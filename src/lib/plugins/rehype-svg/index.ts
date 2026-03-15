import "mdast-util-mdx-jsx";
import type { ElementContent, Root, Element, Parent } from "hast";
import { isElement } from "hast-util-is-element";
import { fromHtml } from "hast-util-from-html";
import type { Plugin, Transformer } from "unified";
import { visit } from "unist-util-visit";

import { addClassToHast, normalizeClassName, readOrFetchSource } from "../plugin_utils";

/**
 * small dev note to self:
 * when building remark / rehype plugins, astro data-caching can cause changes /
 * console-logging not to show up.
 * Use `npx astro dev --force` to clear data store.
 */

/* src: https://github.com/Robot-Inventor/rehype-image-caption/blob/main/src/index.ts */
const isImage = (node: ElementContent): boolean => {
    try {
        if (node.type === "mdxJsxFlowElement" && ["astro-image", "img"].includes(node.name ?? "")) {
            return true;
        }
        return isElement(node, "img");
    } catch {
        return false;
    }
};

export interface RehypeSvgOptions {
    /**
     * @default `rehyped-inline-svg`
     */
    svgClass?: string;

    /**
     * @default `rehyped-inline-svg-wrapper`
     */
    svgWrapperClass?: string;
}

const rehypeSvg: Plugin<[RehypeSvgOptions?], Root> = (options: RehypeSvgOptions = {}) => {
    const { svgClass = "rehyped-inline-svg", svgWrapperClass = "rehyped-inline-svg-wrapper" } = options;

    const transformer: Transformer<Root> = async (tree, file) => {
        const jobs: Promise<void>[] = [];

        const filePath = file.path;

        const nodesToReplace: { parent: Parent; index: number; wrapper: Element }[] = [];

        visit(tree, "element", (node: Element, index?: number, parent?: Parent) => {
            if (!isImage(node) || !parent || index == null) return;

            const imageElement = node as Element;

            const imageSrc = imageElement.properties?.src;

            if (!imageSrc || typeof imageSrc !== "string") return;

            if (!imageSrc.includes("svg")) return;

            jobs.push(
                (async () => {
                    try {
                        let svgText = await readOrFetchSource(imageSrc, filePath);
                        if (svgText === null) return;

                        const svgStart = svgText.indexOf("<svg");
                        if (svgStart === -1) return;
                        svgText = svgText.slice(svgStart);

                        const hastTree = fromHtml(svgText, { fragment: true });

                        const svgElement = hastTree.children.find((n) => isElement(n, "svg"));

                        if (!svgElement) return;

                        /* Process the element's class list */
                        {
                            const imgClasses = normalizeClassName(imageElement.properties?.className);
                            const existingClasses = normalizeClassName(svgElement.properties?.className);

                            svgElement.properties.className = [...existingClasses, ...imgClasses, svgClass];
                        }

                        const wrapper: Element = {
                            type: "element",
                            tagName: "div",
                            properties: { className: [svgWrapperClass] },
                            children: [svgElement],
                        };

                        nodesToReplace.push({ parent, index, wrapper });
                    } catch (err) {
                        console.warn(`[a2 plugin] Error processing image with src "${imageSrc}": ${err}`);
                    }
                })(),
            );
        });

        await Promise.all(jobs);

        for (const { parent, index, wrapper } of nodesToReplace) {
            parent.children[index] = wrapper;
        }
    };

    return transformer;
};

export default rehypeSvg;
