import "mdast-util-mdx-jsx";
import type { ElementContent, Root, Element } from "hast";
import type { Plugin, Transformer } from "unified";
import { isElement } from "hast-util-is-element";
import { visit } from "unist-util-visit";

import { addClassToHast } from "../utils";

export const isTopLevel = (node: Element): boolean => {
    if (!node || (node.type !== "element" && node.type !== "root")) {
        return false;
    }

    // Block-level containers
    return ["p", "div", "figure", "section", "article"].includes(node.tagName);
};

export const isImageOrTopLevelSvg = (node: ElementContent, parent: Element): boolean => {
    try {
        if (node.type === "mdxJsxFlowElement" && ["astro-image", "img"].includes(node.name ?? "")) {
            return true;
        }
        if (isElement(node, "img")) return true;
        if ((node.type === "mdxJsxFlowElement" && node.name === "svg") || isElement(node, "svg")) {
            return isTopLevel(parent);
        }
    } catch {
        return false;
    }

    return false;
};

export interface RehypeCaptionsOptions {
    /**
     * @default `rehyped-figure`
     */
    figureClass?: string;

    /**
     * @default `rehyped-figcaption`
     */
    figcaptionClass?: string;
}

/**
 * @param options RehypeCaptionsOptions
 * @returns Transformer
 *
 */
const rehypeCaptions: Plugin<[RehypeCaptionsOptions?], Root> = (options: RehypeCaptionsOptions = {}) => {
    const { figureClass = "rehyped-figure", figcaptionClass = "rehyped-figcaption" } = options;

    /**
     * Transformer
     * @param tree Root node
     */
    const transformer: Transformer<Root> = (tree) => {
        visit(tree, "element", (node) => {
            const [firstChild] = node.children;
            if (!firstChild) return;

            if (!isImageOrTopLevelSvg(firstChild, node)) return;
            if (node.children.length === 1) return; /* return if no other children are found */

            node.tagName = "figure"; // convert to figure
            addClassToHast(node, figureClass);

            let parsedChildList: ElementContent[] = [];
            for (let i = 1; i < node.children.length; i++) {
                /* skip img */
                const child = node.children[i];
                /* ts infers type too tightly with `isElement(child, "em") */
                if (isElement(child) && child.tagName === "em") {
                    child.tagName = "p";
                    parsedChildList.push(child);
                }
            }

            node.children = [
                firstChild,
                {
                    type: "element",
                    tagName: "figcaption",
                    properties: { className: [figcaptionClass] },
                    children: parsedChildList,
                },
            ];
        });
    };

    return transformer;
};

export default rehypeCaptions;
