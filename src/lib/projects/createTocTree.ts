import type { MarkdownHeading } from "astro";

export type TocNode = MarkdownHeading & { children: TocNode[] };

/* creates a tree data structure from the list of `MarkdownHeading`'s that Astro content collections provide */
/* Headings are given as a flat list */
export default function (headings: MarkdownHeading[]): TocNode {
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
