import { type Options as RehypeAutoLinkOptions } from "rehype-autolink-headings";

import type { Element } from "hast";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "lucide-react";
import { fromHtml } from "hast-util-from-html";
import { isElement } from "hast-util-is-element";
import { parseSelector } from "hast-util-parse-selector";

const HEADER_CLASSNAME = "heading-with-anchor";
const ANCHOR_CLASSNAME = "heading-anchor";
const ANCHOR_ICON_CLASSNAME = "heading-anchor-icon";

const CSS_VARIABLE_PREFIX = "--a2-";
const ANCHOR_ICON_BODY_VARNAME = "anchor-icon-body";
const ANCHOR_ICON_STROKE_WIDTH_VARNAME = "anchor-icon-stroke-width";

export const HeadingAnchorIconElement: Element | undefined = (() => {
    const svgString = renderToStaticMarkup(
        <Link
            className={`${ANCHOR_ICON_CLASSNAME} h-full w-full`}
            stroke={`var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_BODY_VARNAME}, #000000)`}
            strokeWidth={`var(${CSS_VARIABLE_PREFIX}${ANCHOR_ICON_STROKE_WIDTH_VARNAME}, 2)`}
        />,
    );

    const root = fromHtml(svgString, { fragment: true });

    return root.children.find((node) => isElement(node, "svg"));
})();

/* alternative FontAwesome option */
const HeadingAnchorFaIconElement: Element = parseSelector(`.${ANCHOR_ICON_CLASSNAME}.fa-solid.fa-link`, "i");

const RehypeAutoLinkSettings: RehypeAutoLinkOptions = {
    behavior: "append",
    properties: { className: [ANCHOR_CLASSNAME], title: "Copy link to clipboard", ariaHidden: true },
    headingProperties: { className: [HEADER_CLASSNAME] },
    content: HeadingAnchorIconElement,
};

export default RehypeAutoLinkSettings;
