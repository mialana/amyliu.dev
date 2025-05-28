import "@/styles/global.css";
import { useState, useLayoutEffect, useMemo } from "react";
import { PositionMap } from "@/lib/Maps";

import { type MarkdownHeading } from "astro";

interface SideBarProps {
    label: string;
    position: keyof typeof PositionMap;
    openInput?: boolean;
    headings?: MarkdownHeading[];
}

export default function SideBar({
    label,
    position,
    headings = [],
    openInput = false,
}: SideBarProps) {
    const [open, setOpen] = useState(openInput);
    const { button, arrowShow, arrowHide } = PositionMap[position];

    const TableOfContents = useMemo(() => {
        /* helper renders the UI for an already-built subtree */
        const renderTree = (nodes: any[]) => (
            <ul className="w-fit not-only:pl-6">
                {nodes.map((n) => (
                    <li
                        key={n.slug}
                        className={`group ${n.children.length > 0 ? "not-last:border-l-1" : "no-children"}`}
                    >
                        <div
                            className={`relative pl-6 group-last:border-l-1 group-[.no-children]:border-l-1`}
                        >
                            <div className="absolute bottom-0 left-0 w-7 border-[0.5px] content-['']"></div>
                            <a
                                href={`#${n.slug}`}
                                className="relative top-3 left-2 hover:underline"
                            >
                                {n.text}
                            </a>
                        </div>

                        {n.children.length > 0 && renderTree(n.children)}
                    </li>
                ))}
            </ul>
        );

        /* build a tree out of the flat heading list */
        const root: any = { depth: 0, children: [] };
        const _stack = [root];

        headings.forEach((h) => {
            while (
                _stack.length &&
                h.depth <= _stack[_stack.length - 1].depth
            ) {
                _stack.pop();
            }
            const node: any = { ...h, children: [] };
            _stack[_stack.length - 1].children.push(node);
            _stack.push(node);
        });

        return renderTree(root.children);
    }, [headings]);

    useLayoutEffect(() => {
        const cellId =
            position === "Left" ? "nav-grid-cell" : "aside-grid-cell";
        const gridCell = document.getElementById(cellId);
        if (gridCell && !openInput) gridCell.classList.toggle("collapse");
    }, []);

    return (
        <nav
            className={`${open ? "w-full min-w-fit border" : "w-0"} transition-default-10 h-full overflow-x-hidden`}
        >
            <button
                className={`absolute h-4 w-4 text-[8px] outline hover:underline ${button}`}
                onClick={() => setOpen(!open)}
            >
                {open ? arrowShow : arrowHide}
            </button>
            {open && (
                <div className="m-4 w-fit overflow-scroll p-4 text-xs leading-relaxed text-nowrap **:border-neutral-300 md:max-w-[30vw]">
                    <h1 className="mb-2 text-base font-semibold">{label}</h1>
                    <div>{TableOfContents}</div>
                </div>
            )}
        </nav>
    );
}
