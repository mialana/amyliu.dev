import { type Options as RehypeAutoLinkOptions } from "rehype-autolink-headings";

import type { Element } from "hast";

const HEADER_CLASSNAME = "heading-with-anchor";
const ANCHOR_CLASSNAME = "heading-anchor";
const ANCHOR_ICON_CLASSNAME = "heading-anchor-icon";

const CSS_VARIABLE_PREFIX = "--a2-";
const ANCHOR_ICON_BODY_VARNAME = "anchor-icon-body";
const ANCHOR_ICON_STROKE_WIDTH_VARNAME = "anchor-icon-stroke-width";

export const HeadingAnchorBasicIconElement: Element = {
    type: "element",
    tagName: "svg",
    properties: {
        xmlns: "http://www.w3.org/2000/svg",
        className: [ANCHOR_ICON_CLASSNAME],
        ariaHidden: "true",
        fill: "none",
        viewBox: "0 0 24 24",
    },
    children: [
        {
            type: "element",
            tagName: "path",
            properties: {
                d: "M14,16 L17,16 C19.2091,16 21,14.2091 21,12 C21,9.79086 19.2091,8 17,8 L14,8",
                stroke: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_VARNAME}, #000000)`,
                strokeWidth: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_STROKE_WIDTH_VARNAME}, 2)`,
                strokeLinecap: "round",
            },
            children: [],
        },
        {
            type: "element",
            tagName: "path",
            properties: {
                d: "M10,16 L7,16 C4.79086,16 3,14.2091 3,12 C3,9.79086 4.79086,8 7,8 L10,8",
                stroke: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_VARNAME}, #000000)`,
                strokeWidth: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_STROKE_WIDTH_VARNAME}, 2)`,
                strokeLinecap: "round",
            },
            children: [],
        },
        {
            type: "element",
            tagName: "line",
            properties: {
                x1: "7.5",
                y1: "12",
                x2: "16.5",
                y2: "12",
                stroke: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_VARNAME}, #000000)`,
                strokeWidth: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_STROKE_WIDTH_VARNAME}, 2)`,
                strokeLinecap: "round",
            },
            children: [],
        },
    ],
};

const RehypeAutoLinkSettings: RehypeAutoLinkOptions = {
    behavior: "append",
    properties: { className: [ANCHOR_CLASSNAME], title: "Link to this heading", ariaHidden: true },
    headingProperties: { className: [HEADER_CLASSNAME] },
    content: HeadingAnchorBasicIconElement,
};

export default RehypeAutoLinkSettings;
