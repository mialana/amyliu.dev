import type { MarkdownHeading } from "astro";
import { stringToBoolean, getRequiredElement } from "@/lib/utils";

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

let tocAbort: AbortController | null = null;

// ran on every mobile media query change
export function initializeTocBehavior(isMobile: boolean) {
    tocAbort?.abort(); // remove all event listeners
    tocAbort = new AbortController();

    const onThisPageButton = getRequiredElement("#on-this-page-button");
    const tocContainerElement = getRequiredElement("#toc-container");
    const tocListElement = getRequiredElement("#toc-list");

    function setTocState(state: boolean) {
        onThisPageButton.ariaExpanded = String(state);
        tocContainerElement.dataset.expanded = String(state);
        tocListElement.ariaHidden = String((!state));
    }

    function listenForPointerDown(e: Event) {
        const el = e.target;
        if (!(el instanceof Node) || tocContainerElement.contains(el)) return;
        setTocState(false);
    }

    function toggleTocState() {
        const currExpanded = stringToBoolean(onThisPageButton.ariaExpanded);
        const nextExpanded = !currExpanded;
        setTocState(nextExpanded);

        document.removeEventListener("pointerdown", listenForPointerDown);

        if (nextExpanded) {
            document.addEventListener("pointerdown", listenForPointerDown, { signal: tocAbort?.signal });
        }
    }

    onThisPageButton.ariaDisabled = String((!isMobile));

    setTocState(!isMobile); // closed default on mobile, open default on desktop
    if (isMobile) {
        onThisPageButton.addEventListener("click", toggleTocState, { signal: tocAbort?.signal });
    }
}
