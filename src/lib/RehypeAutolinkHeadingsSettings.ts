import { type Options as RehypeAutoLinkOptions } from "rehype-autolink-headings";

import type { Element } from "hast";

const WRAPPER_CLASSNAME = "heading-with-anchor-wrapper";
const ANCHOR_CLASSNAME = "heading-anchor";
const ANCHOR_ICON_CLASSNAME = "heading-anchor-icon";

const CSS_VARIABLE_PREFIX = "--a2-";
const ANCHOR_ICON_OUTLINE_NAME = "anchor-icon-outline";
const ANCHOR_ICON_OUTLINE_WIDTH_NAME = "anchor-icon-outline-width";
const ANCHOR_ICON_BODY_NAME = "anchor-icon-body";
const ANCHOR_ICON_CONNECTOR_NAME = "anchor-icon-connector";

export const HeadingAnchorIconElement: Element = {
    type: "element",
    tagName: "svg",
    properties: {
        fill: "#000000",
        viewBox: "-0.72 -0.72 25.44 25.44",
        id: "link-alt",
        dataName: "Flat Color",
        xmlns: "http://www.w3.org/2000/svg",
        className: ["icon", "flat-color", ANCHOR_ICON_CLASSNAME],
        stroke: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_CONNECTOR_NAME}, #000000)`,
        strokeWidth: "0.00024000000000000003",
        ariaHidden: "true",
        focusable: "false",
    },
    children: [
        { type: "element", tagName: "g", properties: { id: "SVGRepo_bgCarrier", strokeWidth: "0" }, children: [] },

        {
            type: "element",
            tagName: "g",
            properties: {
                id: "SVGRepo_tracerCarrier",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                stroke: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_OUTLINE_NAME}, #000000)`,
                strokeWidth: `var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_OUTLINE_WIDTH_NAME}, 3)`,
                fill: "none"
            },
            children: [
                {
                    type: "element",
                    tagName: "path",
                    properties: {
                        id: "primary",
                        d: "M20.67,3.33a4.53,4.53,0,0,0-6.41,0l-2.5,2.5A4.47,4.47,0,0,0,10.43,9a4.52,4.52,0,0,0,.35,1.75,4.54,4.54,0,0,0-4.95,1l-2.5,2.5A4.54,4.54,0,0,0,6.54,22a4.48,4.48,0,0,0,3.2-1.33l2.5-2.5A4.47,4.47,0,0,0,13.57,15a4.52,4.52,0,0,0-.35-1.75,4.58,4.58,0,0,0,1.74.35,4.49,4.49,0,0,0,3.21-1.33l2.5-2.5a4.53,4.53,0,0,0,0-6.41Z",
                        className: [ANCHOR_ICON_OUTLINE_NAME, "primary"],
                    },
                    children: [],
                },
                {
                    type: "element",
                    tagName: "path",
                    properties: {
                        id: "secondary",
                        d: "M10,15a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l4-4a1,1,0,0,1,1.42,1.42l-4,4A1,1,0,0,1,10,15Z",
                        className: [ANCHOR_ICON_OUTLINE_NAME, "secondary"],
                    },
                    children: [],
                },
            ],
        },

        {
            type: "element",
            tagName: "g",
            properties: { id: "SVGRepo_iconCarrier" },
            children: [
                {
                    type: "element",
                    tagName: "path",
                    properties: {
                        id: "primary",
                        d: "M20.67,3.33a4.53,4.53,0,0,0-6.41,0l-2.5,2.5A4.47,4.47,0,0,0,10.43,9a4.52,4.52,0,0,0,.35,1.75,4.54,4.54,0,0,0-4.95,1l-2.5,2.5A4.54,4.54,0,0,0,6.54,22a4.48,4.48,0,0,0,3.2-1.33l2.5-2.5A4.47,4.47,0,0,0,13.57,15a4.52,4.52,0,0,0-.35-1.75,4.58,4.58,0,0,0,1.74.35,4.49,4.49,0,0,0,3.21-1.33l2.5-2.5a4.53,4.53,0,0,0,0-6.41Z",
                        style: `fill: var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_NAME}, #000000);`,
                        className: [ANCHOR_ICON_BODY_NAME, "primary"],
                    },
                    children: [],
                },
                {
                    type: "element",
                    tagName: "path",
                    properties: {
                        id: "secondary",
                        d: "M10,15a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l4-4a1,1,0,0,1,1.42,1.42l-4,4A1,1,0,0,1,10,15Z",
                        style: `fill: var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_CONNECTOR_NAME}, #ffffff);`,
                        className: [ANCHOR_ICON_CONNECTOR_NAME, "secondary"],
                    },
                    children: [],
                },
            ],
        },
    ],
};

const RehypeAutoLinkSettings: RehypeAutoLinkOptions = {
    behavior: "append",
    properties: { className: [ANCHOR_CLASSNAME] },
    content: HeadingAnchorIconElement,
};

export default RehypeAutoLinkSettings;
