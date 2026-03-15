import { type Config } from "prettier";

const config: Config = {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],

    // Global default options for all files
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    objectWrap: "collapse",
    bracketSameLine: true,
    endOfLine: "lf",
    proseWrap: "never",
    singleAttributePerLine: false,
    overrides: [{ files: "*.css", options: { printWidth: 200 } }],
};

export default config;
