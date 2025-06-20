// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import rehypeMermaid from "rehype-mermaid";

import expressiveCode from "astro-expressive-code";

const expressiveCodeConfig = { shiki: { langAlias: { usda: "bash" } } };

// https://astro.build/config
export default defineConfig({
    site: "https://amyliu.dev/",
    integrations: [
        react(),
        sitemap(),
        expressiveCode(expressiveCodeConfig),
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
