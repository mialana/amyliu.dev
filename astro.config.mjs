// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import remarkMath from "remark-math";
import rehypeMathJaxChtml from "rehype-mathjax/chtml";

import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeConfig = {
    plugins: [pluginLineNumbers()],
    shiki: { langAlias: { usda: "bash" } },
    styleOverrides: { borderRadius: "0.375rem", codePaddingInline: "0.5rem" },
    themes: ["gruvbox-dark-hard"],
    minSyntaxHighlightingColorContrast: 7.5,
    defaultProps: { wrap: true, showLineNumbers: true },
};

// https://astro.build/config
export default defineConfig({
    server: { host: "0.0.0.0" },
    site: "https://amyliu.dev/",
    integrations: [
        react(),
        sitemap(),
        astroExpressiveCode(expressiveCodeConfig),
        mdx(),
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
        ],
    },
});
