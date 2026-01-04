import { type Options as RehypeAutoLinkOptions } from "rehype-autolink-headings";

import type { Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { isElement } from "hast-util-is-element";
import { parseSelector } from "hast-util-parse-selector";

import { normalizeClassName } from "./plugins/utils";

const WRAPPER_CLASSNAME = "heading-with-anchor-wrapper";
const HEADER_CLASSNAME = "heading-with-anchor";
const ANCHOR_CLASSNAME = "heading-anchor";
const ANCHOR_WITH_SCROLL_BEHAVIOR_CLASSNAME = "anchor-with-scroll-behavior";
const ANCHOR_ICON_CLASSNAME = "heading-anchor-icon";

const CSS_VARIABLE_PREFIX = "--a2-";
const ANCHOR_ICON_BODY_VARNAME = "anchor-icon-body";
const ANCHOR_ICON_STROKE_WIDTH_VARNAME = "anchor-icon-stroke-width";

/* keeping two different methods to create a hast element of a desired icon */

/* 1. From raw html */
const LucideLinkIconHtml = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke='var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_VARNAME}, #000000)'
    stroke-width='var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_STROKE_WIDTH_VARNAME}, 2)'
    stroke-linecap="round"
    stroke-linejoin="round"
    class='${ANCHOR_ICON_CLASSNAME} lucide lucide-link-icon lucide-link'
>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
</svg>;
`;

export const HeadingAnchorIconElementFromHtml: Element | undefined = (() => {
    const hast = fromHtml(LucideLinkIconHtml, { fragment: true });

    const svgElement = hast.children.find((node): node is Element => isElement(node, "svg"));

    if (!svgElement) {
        return;
    }

    return svgElement;
})();

/* 2. alternative FontAwesome option using `parseSelector` hast util */
export const HeadingAnchorFaIconElement: Element = parseSelector(`.${ANCHOR_ICON_CLASSNAME}.fa-solid.fa-link`, "i");

export const HeadingAnchorWrapper: Element = parseSelector(`.${WRAPPER_CLASSNAME}`);

const RehypeAutoLinkSettings: RehypeAutoLinkOptions = {
    behavior: "append",
    properties(node) {
        return {
            className: [
                ...normalizeClassName(node.properties.className),
                ANCHOR_CLASSNAME,
                ANCHOR_WITH_SCROLL_BEHAVIOR_CLASSNAME,
            ],
            title: "Copy link to clipboard",
            ariaHidden: true,
        };
    },
    headingProperties(node) {
        // use normalizeClassName as that does not mutate the original element
        return { className: [...normalizeClassName(node.properties?.className), HEADER_CLASSNAME] };
    },
    content: HeadingAnchorIconElementFromHtml,
};

export default RehypeAutoLinkSettings;
