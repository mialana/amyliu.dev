/* Inline script that prevents the default scroll behavior on hash change,
 * as the main grid cell is the container that scrolls.
 */

/* ported from https://stackoverflow.com/a/68283646 */
(() => {
    window.addEventListener(
        "scroll",
        (e) => {
            console.log("called");
        },
        false,
    );

    function handleHashScroll() {
        if (!location.hash) return;

        const id = decodeURIComponent(location.hash.slice(1));
        const target = document.getElementById(id);
        const mainGridCell = document.getElementById("main-grid-cell");

        if (!target || !mainGridCell) return;

        const savedHash = location.hash;

        history.replaceState(null, "", location.pathname + location.search);

        const computedTop =
            target.getBoundingClientRect().top - mainGridCell.getBoundingClientRect().top + mainGridCell.scrollTop;

        console.log("targetUpperBound", target.getBoundingClientRect().top);
        console.log("main grid cell upper bound", mainGridCell.getBoundingClientRect().top);
        console.log("main grid cell scroll top", mainGridCell.scrollTop);
        console.log("computed top", computedTop);

        // mainGridCell.scrollIntoView({ top: computedTop, block: "start", inline: "nearest", behavior: "auto" });

        setTimeout(() => {
            history.replaceState(null, "", location.pathname + location.search + savedHash);
        }, 100);
    }

    window.addEventListener("hashchange", handleHashScroll, false);
    window.addEventListener("DOMContentLoaded", handleHashScroll, false);
})();
