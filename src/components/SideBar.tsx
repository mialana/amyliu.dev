import "@/styles/global.css";

import { useState, useLayoutEffect } from "react";

import { PositionMap } from "@/lib/Maps";

interface NavBarProps {
    position: keyof typeof PositionMap;
    openInput?: boolean;
}

export default function NavBar({ position, openInput = false }: NavBarProps) {
    const [open, setOpen] = useState(openInput);

    const positionInfo = PositionMap[position];

    useLayoutEffect(() => {
        // Get grid cell based on passed in position prop
        const gridCell =
            position == "Left"
                ? document.getElementById("nav-grid-cell")
                : document.getElementById("aside-grid-cell");

        if (!gridCell) return;

        if (!openInput) {
            gridCell.classList.toggle("collapse");
        }
    }, []);

    return (
        <div
            className={`${open ? "w-full min-w-fit border" : "w-0"} transition-default-10 h-full overflow-hidden`}
        >
            <button
                id={`${position}-toggle-button`}
                className={`absolute h-4 w-4 text-[8px] outline hover:underline ${positionInfo["button"]}`}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                {open ? positionInfo["arrowShow"] : positionInfo["arrowHide"]}
            </button>
            <ul className="mx-4 my-6 list-inside list-[square] overflow-hidden text-sm leading-relaxed *:hover:underline md:w-auto">
                <li>
                    <a href="/#landing">Landing</a>
                </li>

                <li>
                    <a href="/#about">About</a>
                </li>
                <li>
                    <a href="/#showcase">Showcase</a>
                </li>
            </ul>
        </div>
    );
}
