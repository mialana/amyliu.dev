import { defineConfig } from "astro/config";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

import sitemap from "@astrojs/sitemap";

import remarkSectionizeHeadings, { type Options as RemarkSectionizeHeadingsOptions } from "remark-sectionize-headings";
import remarkMath from "remark-math"; /* converts to 'language-math' */

import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeMathML from "@daiji256/rehype-mathml"; /* converts 'language-math' to mathML via temml */
import rehypeExpressiveCode, { ExpressiveCodeTheme } from "rehype-expressive-code";
import rehypeCallouts from "rehype-callouts";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCaptions from "./src/lib/plugins/rehype-captions"; /* custom */
import rehypeSvg from "./src/lib/plugins/rehype-svg"; /* custom */
import rehypeWrapMath from "./src/lib/plugins/rehype-wrap-math"; /* custom */

import astroExpressiveCode, { type AstroExpressiveCodeOptions } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLanguageBadge } from "expressive-code-language-badge";
import { pluginCodeCaptions } from "./src/lib/plugins/ec-code-captions"; /* custom */

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import d2 from "astro-d2"; /* modern alternative to mermaid */

import RehypeAutolinkHeadingsSettings from "./src/lib/RehypeAutolinkHeadingsSettings";

const expressiveCodeThemeSelector = (theme: ExpressiveCodeTheme) => {
    if (expressiveCodeConfig.themes && theme.name === expressiveCodeConfig.themes[0]) {
        return "[data-theme='dark']";
    }
    return "[data-theme='light']"; /* default light */
};

const expressiveCodeConfig: AstroExpressiveCodeOptions = {
    plugins: [pluginLanguageBadge(), pluginCodeCaptions(), pluginLineNumbers(), pluginCollapsibleSections()],
    shiki: { langAlias: { usd: "python", usda: "python", math: "ini" } } /* math is included as a fallback */,
    themes: ["andromeeda", "slack-ochin"],
    themeCssRoot: ":root" /* already the default, but just in case */,
    themeCssSelector: expressiveCodeThemeSelector,
    useDarkModeMediaQuery: false /* false because it should depend on my custom theme state */,
    useThemedSelectionColors: true /* themes can set selection colors */,
    defaultProps: {
        wrap: true,
        showLineNumbers: true,
        collapseStyle: "collapsible-auto",
        collapsePreserveIndent: true,
    },
    cascadeLayer: "ecLayer", // place ec styles into a named cascade layer
};

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
    vite: { plugins: [tailwindcss()], css: { devSourcemap: true } },
    devToolbar: { enabled: false },
    markdown: {
        remarkPlugins: [
            [remarkMath, { singleDollarTextMath: true }],
            [remarkSectionizeHeadings as RemarkPlugin<[RemarkSectionizeHeadingsOptions?]>, { addClass: "md-section" }],
        ],
        rehypePlugins: [
            rehypeMathML /* must run before `rehypeExpressiveCode */,
            [rehypeExpressiveCode, { tabWidth: 2 }],
            rehypeSlug /* must run before `rehypeAutolinkHeadings */,
            [rehypeAutolinkHeadings, RehypeAutolinkHeadingsSettings] /* add generated link to `heading-anchor` class */,
            rehypeCaptions,
            rehypeCallouts,
            rehypeWrapMath,
            rehypeRaw /* must run before `rehypeSvg` but after rehypeExpressiveCode */,
            rehypeSvg,
        ],
    },
});
