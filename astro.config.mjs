// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import remarkMath from "remark-math";

import rehypeMathJaxChtml from "rehype-mathjax/chtml";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeImageCaption from "rehype-image-caption";
import rehypeCallouts from "rehype-callouts";

import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginCodeCaption } from "@fujocoded/expressive-code-caption";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import d2 from "astro-d2";

/**
 * @returns {import("expressive-code").ExpressiveCodePlugin}
 */
export function codeCaption() {
    return /** @type {import("expressive-code").ExpressiveCodePlugin} */ (
        pluginCodeCaption()
    );
}

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeConfig = {
    plugins: [pluginLineNumbers(), pluginCollapsibleSections(), codeCaption()],
    shiki: { langAlias: { usda: "bash" } },
    styleOverrides: { borderRadius: "0.375rem", codePaddingInline: "0.5rem" },
    themes: ["gruvbox-dark-hard"],
    minSyntaxHighlightingColorContrast: 7.5,
    defaultProps: {
        wrap: true,
        showLineNumbers: true,
        collapseStyle: "collapsible-auto",
    },
};

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
const rehypeExpressiveCodeOptions = { tabWidth: 2 };

// https://astro.build/config
export default defineConfig({
    server: { host: "0.0.0.0" },
    site: "https://amyliu.dev/",
    integrations: [
        sitemap(),
        astroExpressiveCode(expressiveCodeConfig),
        react(),
        d2({ layout: "elk", theme: { default: "300" }, sketch: true }),
    ],
    vite: { plugins: [tailwindcss()] },
    devToolbar: { enabled: false },
    markdown: {
        remarkPlugins: [[remarkMath, { singleDollarTextMath: true }]],
        rehypePlugins: [
            [
                rehypeMathJaxChtml,
                {
                    chtml: {
                        fontURL:
                            "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
                    },
                },
            ],
            [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
            [rehypeImageCaption, {}],
            [rehypeCallouts, {}],
        ],
    },
});
