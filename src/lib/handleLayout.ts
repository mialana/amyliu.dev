export default function handleLayout() {
    document.addEventListener("DOMContentLoaded", () => {
        const rootElement = document.documentElement;
        const horizontalBreakpoint = window
            .getComputedStyle(rootElement)
            .getPropertyValue("--breakpoint-desktop")
            .trim();

        const isHorizontal = window.matchMedia(`(min-width: ${horizontalBreakpoint})`);

        function handleResize() {
            if (isHorizontal.matches) {
                rootElement.dataset.media = "desktop";
            } else {
                rootElement.dataset.media = "mobile";
            }
        }

        window.addEventListener("load", handleResize);
        isHorizontal.addEventListener("change", handleResize);
    });
}
