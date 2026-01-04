/**
 * a simple remark plugin that allows me to have some markdown content marked as 'writeup-incomplete',
 * which effectively signals the plugin to replace the content with a "coming soon" GIF.
 */

import type { Plugin } from "unified";
import type { Root, Heading, Image, Paragraph, Emphasis } from "mdast";

interface RemarkComingSoonOptions {
    headingText?: string;
    headingClass?: string;
    imageClass?: string;
    imageWrapperClass?: string;
    includeDate?: boolean;
}

const remarkComingSoon: Plugin<[RemarkComingSoonOptions?], Root> = (options: RemarkComingSoonOptions = {}) => {
    const {
        headingText = "Writeup Coming Soon...",
        headingClass = "coming-soon-heading",
        imageClass = "coming-soon-image",
        imageWrapperClass = "coming-soon-image-wrapper",
        includeDate = true,
    } = options;

    return (tree, file) => {
        const frontmatter = file.data?.astro?.frontmatter;
        const writeupIncomplete = frontmatter?.["writeup-incomplete"] === true;

        if (!writeupIncomplete) return;

        const headingNode: Heading = {
            type: "heading",
            depth: 2,
            data: { hProperties: { className: headingClass } },
            children: [{ type: "text", value: headingText }],
        };

        const imageNode: Image = {
            type: "image",
            url: "/resources/gif/coming_soon.gif",
            alt: "Coming soon",
            data: { hProperties: { className: imageClass } },
        };

        // since remark output is static, this is the current date but ends up being the date of latest build.
        const dateLastBuilt = includeDate
            ? `${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`
            : "";

        // this node is converted to a caption and already gets a classname,
        //  courtesy of my `rehype-captions` plugin!
        const captionNode: Emphasis = {
            type: "emphasis",
            children: [
                { type: "text", value: `More details about this project are in the works! Site last updated ` },
                { type: "strong", children: [{ type: "text", value: dateLastBuilt }] },
                { type: "text", value: "." },
            ],
        };

        // wrap the image in a paragraph MDAST node
        const imageWrapper: Paragraph = {
            type: "paragraph",
            data: { hProperties: { className: imageWrapperClass } },
            children: [imageNode, captionNode],
        };

        tree.children = [headingNode, imageWrapper];
    };
};

export default remarkComingSoon;
