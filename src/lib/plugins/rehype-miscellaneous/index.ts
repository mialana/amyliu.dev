// rehype plugin that does some miscellaneous things so I start off with a fresh HTML document.
// running list of tasks:
// 1. wrap `math` elements in a div for styling purposes
// 2. makes links (that aren't internal heading anchors) open in new tabs

import "mdast-util-mdx-jsx";
import type { Root, Element, Parent } from "hast";
import { isElement } from "hast-util-is-element";
import type { Plugin, Transformer } from "unified";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import { addClassToHast, normalizeClassName } from "../utils";

export interface RehypeMiscellaneousOptions {
    mathWrapperClass?: string;
    externalOpenLinkClass?: string;
}

const rehypeMiscellaneous: Plugin<[RehypeMiscellaneousOptions?], Root> = (options: RehypeMiscellaneousOptions = {}) => {
    const { mathWrapperClass = "math-wrapper", externalOpenLinkClass = "external-open-link" } = options;

    const transformer: Transformer<Root> = (tree) => {
        visit(tree, "element", (node: Element, index?: number, parent?: Parent) => {
            // 1. math
            (() => {
                if (!isElement(node, "math")) return;
                if (!parent || index === undefined) return;

                const classList = normalizeClassName(node.properties?.className);

                if (!classList.includes("tml-display")) return; // do not apply to inline math

                const wrapperElement = h(`.${mathWrapperClass}`, [node]);

                parent.children.splice(index, 1, wrapperElement);
            })();

            // 2. links
            // set all links that aren't internal header hash links to open to new tab
            (() => {
                if (!isElement(node, "a")) return;

                const href = node.properties?.href;
                if (typeof href !== "string") return;
                // use `startsWith` rather than class name to avoid more order-dependency
                if (href.startsWith("#")) return;

                node.properties.target = "_blank";
                node.properties.rel = "noopener noreferrer";

                addClassToHast(node, externalOpenLinkClass);
            })();
        });
    };

    return transformer;
};

export default rehypeMiscellaneous;
