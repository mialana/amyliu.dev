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

export function handleOnThisPageBehavior() {
    const onThisPageElement = document.getElementById("on-this-page");
    const tocListElement = document.getElementById("toc-list");
    if (!onThisPageElement || !tocListElement) return;

    onThisPageElement.addEventListener("click", (e) => {
        positionTocElement(tocListElement, onThisPageElement);

        const tocExpanded = onThisPageElement.getAttribute("aria-expanded") === "true";

        tocListElement.classList.toggle("max-h-[25vh]", !tocExpanded);
        tocListElement.classList.toggle("max-h-0", tocExpanded);
        onThisPageElement.setAttribute("aria-expanded", String(!tocExpanded)); // converts from boolean to string
    });
}
