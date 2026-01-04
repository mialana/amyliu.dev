/**
 * This is a hosted script module for detecting theme immediately on page load and
 * setting up event listeners for theme changes.
 * This is necessary to eliminate all latency that can result from retrieving the stored theme in
 * localStorage and making changes in the DOM.
 *
 * React should especially be avoided as there is considerable load delays even in `useLayoutEffect`.
 *
 * */

function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* in IOS the very top bar depends on the `theme-color` meta attribute in HTML head for color */
function updateHtmlThemeColorMeta() {
    const color = getCssVar("--color-secondary-shade");

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
    }

    console.log(color);
    meta.setAttribute("content", color);
}

(() => {
    const ROOT_DATA_ATTRIBUTE = "data-theme";
    const LOCAL_STORAGE_VARNAME = "theme";
    const LIGHT_THEME_TEXT = "light";
    const DARK_THEME_TEXT = "dark";

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function commitThemeChange(desiredTheme) {
        document.documentElement.setAttribute(ROOT_DATA_ATTRIBUTE, desiredTheme);
        localStorage.setItem(LOCAL_STORAGE_VARNAME, desiredTheme);

        requestAnimationFrame(updateHtmlThemeColorMeta); // must happen after the data attribute is set!
    }

    const getThemeFromDetectedMedia = () => {
        return media.matches ? DARK_THEME_TEXT : LIGHT_THEME_TEXT;
    };

    const setThemeFromDetectedMedia = () => {
        const nextTheme = getThemeFromDetectedMedia();

        commitThemeChange(nextTheme);
    };

    media.addEventListener("change", setThemeFromDetectedMedia); // watch for if media changes

    // set up observer that will update "theme-color" meta on `data-theme` mutation
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === "attributes" && m.attributeName === ROOT_DATA_ATTRIBUTE) {
                requestAnimationFrame(updateHtmlThemeColorMeta);
            }
        }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: [ROOT_DATA_ATTRIBUTE] });

    const theme = (() => {
        if (typeof localStorage !== "undefined") {
            const foundTheme = localStorage.getItem(LOCAL_STORAGE_VARNAME);
            if (foundTheme && (foundTheme == LIGHT_THEME_TEXT || foundTheme == DARK_THEME_TEXT)) return foundTheme;
        }

        return getThemeFromDetectedMedia(); // defer to media detetion IF no item found in localStorage
    })();

    commitThemeChange(theme); // commit the initial theme detected on mount
})();
