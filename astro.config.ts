import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import remarkMath from "remark-math";
import remarkSectionizeHeadings from "./src/lib/plugins/remark-sectionize-headings";

import rehypeMathJaxChtml from "rehype-mathjax/chtml";
import rehypeExpressiveCode from "rehype-expressive-code";
// import rehypeImageCaption from "rehype-image-caption";
import rehypeCallouts from "rehype-callouts";
import rehypeImageCaption from "./src/lib/plugins/rehype-image-captions";

import astroExpressiveCode, {type AstroExpressiveCodeOptions} from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginCodeCaptions } from "./src/lib/plugins/ec-code-captions";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import d2 from "astro-d2";

const expressiveCodeConfig: AstroExpressiveCodeOptions = {
    plugins: [pluginLineNumbers(), pluginCollapsibleSections(), pluginCodeCaptions()],
    shiki: { langAlias: { usda: "bash" } },
    themes: ["gruvbox-dark-hard"],
    minSyntaxHighlightingColorContrast: 7.5,
    defaultProps: { wrap: true, showLineNumbers: true, collapseStyle: "collapsible-auto" },
    cascadeLayer: "ecLayer", // place ec styles into a named cascade layer
    styleOverrides: {
        uiFontFamily: "inherit",
        uiFontSize: "inherit",
        uiFontWeight: "inherit",
        uiLineHeight: "inherit",
    },
};

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
const rehypeExpressiveCodeOptions = { tabWidth: 2 };

const isCloudflare = process.env.CLOUDFLARE_WORKER === "1";

// https://astro.build/config
export default defineConfig({
    server: { host: "0.0.0.0" },
    site: "https://amyliu.dev/",
    integrations: [
        sitemap(),
        astroExpressiveCode(expressiveCodeConfig),
        react(),
        d2({
            layout: "elk",
            theme: { default: "300" },
            sketch: true,
            skipGeneration: isCloudflare, // disable build of astro-d2 in CI
        }),
    ],
    vite: { plugins: [tailwindcss()] },
    devToolbar: { enabled: false },
    markdown: {
        remarkPlugins: [
            [remarkMath, { singleDollarTextMath: true }],
            [remarkSectionizeHeadings, { addClass: "section" }],
        ],
        rehypePlugins: [
            [
                rehypeMathJaxChtml,
                { chtml: { fontURL: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2" } },
            ],
            [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
            [rehypeImageCaption, { wrapImagesWithoutCaptions: false }],
            [rehypeCallouts, {}],
        ],
    },
});
