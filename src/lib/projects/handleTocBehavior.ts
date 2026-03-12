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

// attach on open, remove on close
const onTocOpenScoped = (tocContainerElement: HTMLElement, tocListElement: HTMLElement) => {
    const onPointerDown = (e: Event) => {
        if (e.target instanceof Node && !tocContainerElement.contains(e.target)) {
            tocContainerElement.setAttribute("aria-expanded", "false");
        }
    };

    document.addEventListener("pointerdown", onPointerDown);

    const cleanup = () => {
        document.removeEventListener("pointerdown", onPointerDown);
        tocContainerElement.removeEventListener("tocClose", cleanup);
    };

    tocContainerElement.addEventListener("tocClose", cleanup);
};

function positionTocElement(tocElement: HTMLElement, onThisPageElement: HTMLElement, mobileMediaQuery: MediaQueryList) {
    if (mobileMediaQuery.matches) {
        const rect = onThisPageElement.getBoundingClientRect();
        tocElement.style.top = `${rect.bottom}px`;
        tocElement.style.left = `${rect.left}px`;
        tocElement.style.width = `${rect.width}px`;
    } else {
        tocElement.removeAttribute("style");
    }
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

        positionTocElement(tocListElement, onThisPageElement, mobileMediaQuery);

        tocContainerElement.setAttribute("aria-expanded", String(expanded)); // converts from boolean to string

        if (!mobileMediaQuery.matches) return; // return only on desktop
        if (expanded) {
            onTocOpenScoped(tocContainerElement, tocListElement);
        } else {
            tocContainerElement.dispatchEvent(new Event("tocClose"));
        }
    }

    function toggleTocState() {
        if (!mobileMediaQuery.matches) return;
        const expanded = tocContainerElement?.getAttribute("aria-expanded") === "true";
        setTocState(!expanded);
    }

    const maintainDefaults = (e: MediaQueryList | MediaQueryListEvent) => {
        setTocState(!e.matches);
    };
    maintainDefaults(mobileMediaQuery);
    mobileMediaQuery.addEventListener("change", maintainDefaults);

    // regardless of media, set up click listener in case of resize in the future
    onThisPageElement.addEventListener("click", toggleTocState);
}
