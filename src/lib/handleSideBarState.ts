export type SideBarType = "nav" | "aside";

export const checkIfMobile = () =>
    window.matchMedia(
        `(max-width: ${getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-desktop").trim()})`,
    ).matches;

function toggleSideBarStyle(button: HTMLButtonElement) {
    const toggledClasses = ["rotate-180", "brightness-50", "brightness-125"];

    toggledClasses.forEach((c) => {
        button.classList.toggle(c);
    });
}

function handleSideBarButtonClicked(button: HTMLButtonElement, sidebarType: SideBarType) {
    const app = document.getElementById("app");
    if (!app) return;

    const key = sidebarType === "nav" ? "navstate" : "asidestate";
    app.dataset[key] = app.dataset[key] === "open" ? "closed" : "open";

    toggleSideBarStyle(button);
}

export function handleSideBarButtonState() {
    // if we are below the 'desktop' breakpoint, i.e. mobile, return
    if (checkIfMobile()) return;

    const app = document.getElementById("app");
    if (!app) return;

    const layout = app.dataset.layout;
    if (!layout) return;

    const isActiveMap = new Map<SideBarType, boolean>([
        ["nav", layout === "BOTH" || layout === "NO_ASIDE"],
        ["aside", layout === "BOTH" || layout === "NO_NAV"],
    ]);

    isActiveMap.forEach((active, sidebarType) => {
        if (!active) return;
        const button = document.getElementById(`${sidebarType}-sidebar-button`);

        if (!(button instanceof HTMLButtonElement)) return;

        button.classList.toggle("desktop:block"); /* make visible if active */
        toggleSideBarStyle(button); // make the button use its 'open' style

        /* set up click event listener */
        button?.addEventListener("click", (event) => {
            if (event.currentTarget) handleSideBarButtonClicked(button, sidebarType);
        });
    });
}
