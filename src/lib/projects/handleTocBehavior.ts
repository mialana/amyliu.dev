import type { MarkdownHeading } from "astro";

export type TocNode = MarkdownHeading & { children: TocNode[] };

/* creates a tree data structure from the list of `MarkdownHeading`'s that Astro content collections provide */
/* Headings are given as a flat list */
export function createTocTree(headings: MarkdownHeading[]): TocNode {
    const root: TocNode = { depth: 0, slug: "", text: "", children: [] };
    const stack: TocNode[] = [root]; // transient stack

    for (const h of headings) {
        let p = stack.at(-1);
        while (stack.length && h.depth <= p!.depth) {
            /* pop until we reach the headings "parent". popping also means this heading has no more children */
            stack.pop();
            p = stack.at(-1);
        }
        const node: TocNode = { ...h, children: [] };
        p!.children.push(node);
        stack.push(node); /* push this node onto stack as a non-processed node */
    }

    return root;
}

function positionTocElement(tocElement: HTMLElement, onThisPageElement: HTMLElement) {
    const rect = onThisPageElement.getBoundingClientRect();

    tocElement.style.top = `${rect.bottom}px`;
    tocElement.style.left = `${rect.left}px`;
    tocElement.style.width = `${rect.width}px`;
}

export function initializeOnThisPageBehavior() {
    const tocContainerElement = document.getElementById("toc-container");
    const onThisPageElement = document.getElementById("on-this-page");
    const tocListElement = document.getElementById("toc-list");
    if (!onThisPageElement || !tocListElement || !tocContainerElement) return;

    const mobileMediaQuery = window.matchMedia(
        `(max-width: ${getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-desktop").trim()})`,
    );

    function setTocState(expanded: boolean) {
        if (!onThisPageElement || !tocListElement || !tocContainerElement) return;

        positionTocElement(tocListElement, onThisPageElement);

        tocContainerElement.setAttribute("aria-expanded", String(expanded)); // converts from boolean to string
    }

    function toggleTocState() {
        if (!mobileMediaQuery.matches) return;
        const expanded = tocContainerElement?.getAttribute("aria-expanded") === "true";
        setTocState(!expanded);
    }

    onThisPageElement.addEventListener("click", toggleTocState);

    const maintainDefaults = (e: MediaQueryList | MediaQueryListEvent) => {
        setTocState(!e.matches);
    };
    maintainDefaults(mobileMediaQuery);
    mobileMediaQuery.addEventListener("change", maintainDefaults);
}
