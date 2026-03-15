import { getRequiredElement } from "@/lib/utils";

export const ROOT_DATA_ATTRIBUTE = "data-theme";
export const LOCAL_STORAGE_VARNAME = "theme";
export const LIGHT_THEME_TEXT = "light";
export const DARK_THEME_TEXT = "dark";

export const ThemeOptions = [LIGHT_THEME_TEXT, DARK_THEME_TEXT] as const;
export type Theme = (typeof ThemeOptions)[number];

export function initializeThemeButton() {
    const button = getRequiredElement("#theme-button");

    let theme: Theme = LIGHT_THEME_TEXT;

    /* all the steps to ensure the theme change has effect globally */
    function commitThemeChange(desiredTheme: Theme) {
        theme = desiredTheme;

        document.documentElement.setAttribute(ROOT_DATA_ATTRIBUTE, desiredTheme);
        localStorage.setItem(LOCAL_STORAGE_VARNAME, desiredTheme);
    }

    function toggle() {
        const nextTheme: Theme = theme === LIGHT_THEME_TEXT ? DARK_THEME_TEXT : LIGHT_THEME_TEXT;

        commitThemeChange(nextTheme);
    }

    button.addEventListener("click", toggle);
}
