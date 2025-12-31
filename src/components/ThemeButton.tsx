import { useEffect, useLayoutEffect, useState } from "react";

import { Button } from "@/external/shadcn/components/ui/button";
import { Moon, Sun } from "lucide-react";

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

export default function ThemeButton() {
    const [theme, setTheme] = useState<Theme>(LIGHT_THEME_TEXT);

    useEffect(() => {
        updateFromDOM(setTheme); // initial call
    }, []);

    /* setup mutation observer for changes to theme from `ThemeClient` */
    useLayoutEffect(() => {
        const root = document.documentElement;

        const observer = new MutationObserver((mutationList) => updateFromDOM(setTheme, mutationList));

        observer.observe(root, { attributes: true, attributeFilter: [ROOT_DATA_ATTRIBUTE] });
        return () => observer.disconnect();
    });

    /* all the steps to ensure the theme change has effect globally */
    function commitThemeChange(desiredTheme: Theme) {
        setTheme(desiredTheme);

        document.documentElement.setAttribute(ROOT_DATA_ATTRIBUTE, desiredTheme);
        localStorage.setItem(LOCAL_STORAGE_VARNAME, desiredTheme);
    }

    function toggle() {
        const nextTheme: Theme = theme === LIGHT_THEME_TEXT ? DARK_THEME_TEXT : LIGHT_THEME_TEXT;

        commitThemeChange(nextTheme);
    }

    return (
        <span
            onClick={toggle}
            className={`${theme === LIGHT_THEME_TEXT ? "fa-moon" : "fa-sun"} fa-solid u-fa-icon text-inverted-primary cursor-pointer text-lg`}
        />
    );
}
