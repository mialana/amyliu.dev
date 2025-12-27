/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            typography: () => ({
                DEFAULT: {
                    css: {
                        "--tw-prose-body": "var(--color-inverted-tertiary)",
                        "--tw-prose-headings": "var(--color-important-text)",
                        "--tw-prose-links": "var(--color-blue-accent)",
                        "--tw-prose-bold": "var(--color-important-text)",
                    },
                },
            }),
        },
    },
};
