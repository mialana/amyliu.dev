// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import embeds from "astro-embed/integration";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: "https://amyliu.dev/",
    integrations: [react(), sitemap(), embeds(), mdx()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            watch: {
                ignored: [".obsidian"],
            },
        },
    },
    devToolbar: {
        enabled: false,
    },
});
