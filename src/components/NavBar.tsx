import "../styles/global.css";

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
        const nav = document.getElementById("main-navbar");
        const width = nav.clientWidth;
        if (width == 0) {
            setOpen(false);
            nav.classList.toggle("hidden");
        }
    }, []);

    return (
        <div
            className={`${open ? "w-full min-w-fit" : "w-0"} transition-default-10 h-full overflow-hidden`}
        >
            <button
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
