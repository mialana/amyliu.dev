// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import rehypeMermaid from "rehype-mermaid";

import astroExpressiveCode from "astro-expressive-code";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeConfig = {
    shiki: { langAlias: { usda: "bash" } },
    styleOverrides: { codeFontSize: "0.75rem", uiFontSize: "0.85rem" },
    themes: ["aurora-x"],
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
        syntaxHighlight: { excludeLangs: ["mermaid"] },
        rehypePlugins: [
            [
                rehypeMermaid,
                {
                    strategy: "img-svg",

                    mermaidConfig: { theme: "default" },
                },
            ],
        ],
    },
});
