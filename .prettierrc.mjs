// .prettierrc.mjs
/** @type {import("prettier").Config} */

export default {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],

    // Global default options for all files
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    objectWrap: "collapse",
};
