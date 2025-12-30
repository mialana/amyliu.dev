import { defineConfig } from "astro/config";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

import sitemap from "@astrojs/sitemap";

import remarkSectionizeHeadings, { type Options as RemarkSectionizeHeadingsOptions } from "remark-sectionize-headings";
import remarkMath from "remark-math"; /* converts to 'language-math' */

import rehypeRaw from "rehype-raw";
import rehypeMathML from "@daiji256/rehype-mathml"; /* converts 'language-math' to mathML via temml */
import rehypeExpressiveCode, { ExpressiveCodeTheme } from "rehype-expressive-code";
import rehypeCallouts from "rehype-callouts";
import rehypeCaptions from "./src/lib/plugins/rehype-captions";
import rehypeSvg from "./src/lib/plugins/rehype-svg";

import astroExpressiveCode, { type AstroExpressiveCodeOptions } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginCodeCaptions } from "./src/lib/plugins/ec-code-captions";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import d2 from "astro-d2"; /* modern alternative to mermaid? */

const expressiveCodeThemeSelector = (theme: ExpressiveCodeTheme) => {
    if (expressiveCodeConfig.themes && theme.name === expressiveCodeConfig.themes[0]) {
        return "[data-theme='dark']";
    }
    return "[data-theme='light']"; /* default light */
};

const expressiveCodeConfig: AstroExpressiveCodeOptions = {
    plugins: [pluginLineNumbers(), pluginCollapsibleSections(), pluginCodeCaptions()],
    shiki: { langAlias: { usda: "bash", math: "bash" } },
    themes: ["gruvbox-dark-hard", "material-theme-lighter"],
    themeCssRoot: ":root" /* already the default, but just in case */,
    themeCssSelector: expressiveCodeThemeSelector,
    minSyntaxHighlightingColorContrast: 7.5,
    useDarkModeMediaQuery: false /* false because it should depend on my custom theme state */,
    useThemedSelectionColors: true /* themes can set selection colors */,
    defaultProps: { wrap: true, showLineNumbers: true, collapseStyle: "collapsible-auto" },
    cascadeLayer: "ecLayer", // place ec styles into a named cascade layer
    styleOverrides: {
        uiFontFamily: "inherit",
        uiFontSize: "inherit",
        uiFontWeight: "inherit",
        uiLineHeight: "inherit",
    },
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
    vite: { plugins: [tailwindcss()] },
    devToolbar: { enabled: false },
    markdown: {
        remarkPlugins: [
            [remarkMath, { singleDollarTextMath: true }],
            [remarkSectionizeHeadings as RemarkPlugin<[RemarkSectionizeHeadingsOptions?]>, { addClass: "md-section" }],
        ],
        rehypePlugins: [
            rehypeRaw /* must run before `rehypeSvg` */,
            rehypeMathML /* must run before `rehypeExpressiveCode */,
            [rehypeExpressiveCode, { tabWidth: 2 }],
            rehypeCaptions,
            rehypeSvg,
            rehypeCallouts,
        ],
    },
});
