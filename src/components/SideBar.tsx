import "@/styles/global.css";
import { useState, useLayoutEffect, useMemo } from "react";
import { PositionMap } from "@/lib/Maps";

import { type MarkdownHeading } from "astro";

interface SideBarProps {
    label: string;
    position: keyof typeof PositionMap;
    active?: boolean;
    headings?: MarkdownHeading[];
}

export default function SideBar({
    label,
    position,
    headings = [],
    active = false,
}: SideBarProps) {
    const [open, setOpen] = useState(false);
    const positionInfo = PositionMap[position];

    const TableOfContents = useMemo(() => {
        /* helper renders the UI for an already-built subtree */
        const renderTree = (nodes: any[]) => (
            <ul className="w-fit not-only:pl-3">
                {nodes.map((n) => (
                    <li
                        key={n.slug}
                        className={`group ${n.children.length > 0 ? "not-last:border-l-1" : "no-children"}`}
                    >
                        <div
                            className={`relative w-fit pr-2 pl-3 group-last:border-l-1 group-[.no-children]:border-l-1`}
                        >
                            <div className="absolute bottom-0 left-0 w-4 border-[0.5px] content-['']"></div>
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
        if (!gridCell) return;

        if (!active) {
            gridCell.classList.toggle("collapse");
            return;
        } else {
            // can only be open on load if not mobile
            setOpen(active && window.screen.width > 768);
        }
    }, []);

    return (
        <nav
            className={`${open ? "absolute z-20 w-screen border md:relative md:w-auto" : "w-0"} bg:white ${positionInfo["absolutePosition"]} transition-default-10 h-full`}
        >
            <button
                className={`absolute z-0 h-4 w-4 text-[8px] outline hover:underline ${positionInfo["absolutePosition"]}`}
                onClick={() => setOpen(!open)}
            >
                {open ? positionInfo["arrowShow"] : positionInfo["arrowHide"]}
            </button>
            {open && (
                <div className="m-4">
                    <h1 className="text-base font-semibold">{label}</h1>
                    <div className="overflow-x-scroll px-1 py-4 text-xs leading-relaxed text-nowrap **:border-neutral-300 md:max-w-[20vw]">
                        {TableOfContents}
                    </div>
                </div>
            )}
        </nav>
    );
}
