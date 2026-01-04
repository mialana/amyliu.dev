/**
 * a simple remark plugin that allows me to have some markdown content marked as 'writeup-incomplete',
 * which effectively signals the plugin to replace the content with a "coming soon" GIF.
 */

import type { Plugin } from "unified";
import type { Root, Heading, Image, Paragraph } from "mdast";

interface RemarkComingSoonOptions {
    headingText?: string;
    headingClass?: string;
    imageClass?: string;
    imageWrapperClass?: string;
    includeDate?: boolean;
}

const remarkComingSoon: Plugin<[RemarkComingSoonOptions?], Root> = (options: RemarkComingSoonOptions = {}) => {
    const {
        headingText = "Project Details Coming Soon",
        headingClass = "coming-soon-heading",
        imageClass = "coming-soon-image",
        imageWrapperClass = "coming-soon-image-wrapper",
        includeDate = true,
    } = options;

    return (tree, file) => {
        const frontmatter = file.data?.astro?.frontmatter;
        const writeupIncomplete = frontmatter?.["writeup-incomplete"] === true;

        if (!writeupIncomplete) return;

        // since remark output is static, this is the current date but ends up being the date of latest build.
        const dateLastBuilt = includeDate
            ? ` (Updated ${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })})`
            : "";

        const headingNode: Heading = {
            type: "heading",
            depth: 2,
            data: { hProperties: { className: headingClass } },
            children: [{ type: "text", value: `${headingText}${dateLastBuilt}` }],
        };

        const imageNode: Image = {
            type: "image",
            url: "/resources/gif/coming_soon.gif",
            alt: "Coming soon",
            title: "More details about this project are coming soon.",
            data: { hProperties: { className: imageClass } },
        };

        // wrap the image in a paragraph MDAST node
        const imageWrapper: Paragraph = {
            type: "paragraph",
            data: { hProperties: { className: imageWrapperClass } },
            children: [imageNode],
        };

        tree.children = [headingNode, imageWrapper];
    };
};

export default remarkComingSoon;
