/**
 * collection of functions that help with scroll behavior with table of content anchors and
 * anchors directly next to headings */

const ANCHOR_WITH_SCROLL_BEHAVIOR_CLASSNAME = "anchor-with-scroll-behavior";
const TOC_ANCHOR_CLASSNAME = "toc-heading-anchor";

export function handleScrollToAnchorTarget(
    anchor: HTMLAnchorElement,
    container: HTMLElement,
    offset = 0,
    behavior: ScrollBehavior = "smooth",
) {
    /* get the hash from the anchor's href */
    const hash = anchor.getAttribute("href");
    if (!hash) return;

    // update URL without triggering native scroll
    history.pushState(null, "", hash);

    const target = document.querySelector(hash);
    if (!target) return;
    if (!(target instanceof HTMLElement)) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    /**
     * `containerRect.top` is absolute Y position, so adding container.scrollTop gets us the correct
     * Y position within the container */
    const top = targetRect.top - containerRect.top + container.scrollTop - offset;

    container.scrollTo({ top, behavior });
}

export default function handleScrollBehavior() {
    window.addEventListener("DOMContentLoaded", () => {
        const container = document.getElementById("main-grid-cell");
        if (!container) return;

        const anchors = document.querySelectorAll<HTMLAnchorElement>(`.${ANCHOR_WITH_SCROLL_BEHAVIOR_CLASSNAME}`);

        /* add event listener for all anchors */
        anchors.forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();

                // manually scroll into view
                handleScrollToAnchorTarget(anchor, container);
                updateActiveHeading(anchor);
            });
        });
    });
}

function toggleHeadingClasses(anchor: HTMLAnchorElement, anchors: NodeListOf<HTMLAnchorElement>) {
    const activeHeadingClassList = ["font-semibold", "text-blue-accent"];

    const container = document.getElementById("main-grid-cell");
    if (!container) return;

    anchors.forEach((a) => {
        if (a === anchor) {
            a.classList.add(...activeHeadingClassList);

            /* prevent default behavior on hash change when anchor has been found */
            history.replaceState(null, "", location.pathname + location.search);

            if (container) handleScrollToAnchorTarget(a, container);
        } else {
            a.classList.remove(...activeHeadingClassList);
        }
    });
}

export function updateActiveHeading(targetAnchor?: HTMLAnchorElement) {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(`.${TOC_ANCHOR_CLASSNAME}`);

    if (targetAnchor) {
        toggleHeadingClasses(targetAnchor, anchors);
    } else {
        const hash = window.location.hash;
        if (!hash || hash === "") {
            return;
        }

        let foundAnchor: HTMLAnchorElement | null = null;

        anchors.forEach((anchor) => {
            if (anchor.getAttribute("href") === hash) foundAnchor = anchor;
        });
        if (foundAnchor === null) return;

        toggleHeadingClasses(foundAnchor, anchors);
    }
}
