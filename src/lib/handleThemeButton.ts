import { z } from "zod";

export const ROOT_DATA_ATTRIBUTE = "data-theme";
export const LOCAL_STORAGE_VARNAME = "theme";
export const LIGHT_THEME_TEXT = "light";
export const DARK_THEME_TEXT = "dark";

const ThemeOptions = [LIGHT_THEME_TEXT, DARK_THEME_TEXT] as const;
export const ThemeSchema = z.enum(ThemeOptions);
export type Theme = (typeof ThemeOptions)[number];

const isThemeMutation = (mutation: MutationRecord) =>
    mutation.type === "attributes" &&
    mutation.target === document.documentElement &&
    mutation.attributeName === ROOT_DATA_ATTRIBUTE;

export const updateFromDOM = (callback: (theme: Theme) => void, mutationList?: MutationRecord[]) => {
    if (mutationList && !mutationList.some(isThemeMutation)) {
        return;
    }

    const foundTheme = document.documentElement.getAttribute(ROOT_DATA_ATTRIBUTE);

    const result = ThemeSchema.safeParse(foundTheme);

    if (result.success) {
        callback(result.data);
    }
};

export function initializeThemeButton() {
    const button = document.getElementById("theme-button");
    if (!button) return;

    let theme: Theme = LIGHT_THEME_TEXT;

    const syncIcon = () => {
        button.classList.toggle("fa-moon", theme === LIGHT_THEME_TEXT);
        button.classList.toggle("fa-sun", theme === DARK_THEME_TEXT);
    };

    updateFromDOM((t) => {
        theme = t;
        syncIcon();
    });

    /* setup mutation observer for changes to theme from `ThemeClient` */
    const root = document.documentElement;

    const observer = new MutationObserver((mutationList) =>
        updateFromDOM((t) => {
            theme = t;
            syncIcon();
        }, mutationList),
    );

    observer.observe(root, { attributes: true, attributeFilter: [ROOT_DATA_ATTRIBUTE] });

    /* all the steps to ensure the theme change has effect globally */
    function commitThemeChange(desiredTheme: Theme) {
        theme = desiredTheme;

        document.documentElement.setAttribute(ROOT_DATA_ATTRIBUTE, desiredTheme);
        localStorage.setItem(LOCAL_STORAGE_VARNAME, desiredTheme);

        syncIcon();
    }

    function toggle() {
        const nextTheme: Theme = theme === LIGHT_THEME_TEXT ? DARK_THEME_TEXT : LIGHT_THEME_TEXT;

        commitThemeChange(nextTheme);
    }

    button.addEventListener("click", toggle);
}
