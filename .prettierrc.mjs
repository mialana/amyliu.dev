// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    overrides: [
        {
            files: ["**/*.astro"],
            excludeFiles: ["**/*.json"],
            options: {
                parser: "astro",
                printWidth: 80,
                tabWidth: 4,
                proseWrap: "preserve",
            },
        },
        {
            files: ["**/*.*js", "**/*.ts"],
            options: {
                parser: "typescript",
                printWidth: 80,
                tabWidth: 4,
                proseWrap: "preserve",
            },
        },
        {
            files: ["**/*.*json"],
            options: {
                parser: "json",
                printWidth: 80,
                tabWidth: 4,
                proseWrap: "preserve",
            },
        },
    ],
};
