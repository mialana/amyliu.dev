// very simple rehype plugin to wrap `math` elements in a div for styling purposes

import "mdast-util-mdx-jsx";
import type { Root, Element, Parent } from "hast";
import { isElement } from "hast-util-is-element";
import type { Plugin, Transformer } from "unified";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import { normalizeClassName } from "../utils";

export interface RehypeWrapMathOptions {
    wrapperClass?: string;
}

const rehypeWrapMath: Plugin<[RehypeWrapMathOptions?], Root> = (options: RehypeWrapMathOptions = {}) => {
    const { wrapperClass = "math-wrapper" } = options;

    const transformer: Transformer<Root> = async (tree) => {
        visit(tree, "element", (node: Element, index?: number, parent?: Parent) => {
            if (!isElement(node, "math")) return;
            if (!parent || !index) return;

            const classList = normalizeClassName(node.properties?.className);
            if (!classList) return;

            if (!classList.includes("tml-display")) return; // do not apply to inline math

            const wrapperElement = h(`.${wrapperClass}`, [node]);

            parent.children.splice(index, 1, wrapperElement);
        });
    };

    return transformer;
};

export default rehypeWrapMath;
