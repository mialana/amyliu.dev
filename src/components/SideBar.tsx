import "@/styles/global.css";

import { useState, useLayoutEffect } from "react";

const PositionMap = {
    Left: { button: "left-0", arrowShow: "◀", arrowHide: "▶" },
    Right: { button: "right-0", arrowShow: "▶", arrowHide: "◀" },
};

interface NavBarProps {
    position: keyof typeof PositionMap;
}

export default function NavBar({ position }: NavBarProps) {
    const [open, setOpen] = useState(true);

    const positionInfo = PositionMap[position];

    useLayoutEffect(() => {
        // Get grid cell based on passed in position prop
        const gridCell =
            position == "Left"
                ? document.getElementById("nav-grid-cell")
                : document.getElementById("aside-grid-cell");

        if (!gridCell) return;
        const width = gridCell.clientWidth;

        if (width == 0) {
            gridCell.classList.toggle("collapse");
        }
    }, []);

    return (
        <div
            className={`${open ? "w-full min-w-fit outline" : "w-0"} transition-default-10 h-full overflow-hidden`}
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
            <ul className="m-8 overflow-hidden text-center text-xl/loose font-medium *:hover:underline">
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
