import "@/styles/global.css";
import { useState, useLayoutEffect, type ReactNode } from "react";
import { hasSlotReact } from "@/lib/hasSlot";

const PositionMap = {
    NAV: { absolutePosition: "left-0", arrowShow: "◀", arrowHide: "▶" },
    ASIDE: { absolutePosition: "right-0", arrowShow: "▶", arrowHide: "◀" },
};

interface SideBarProps {
    category?: keyof typeof PositionMap;
    active?: boolean;
    children?: any;
}

export default function SideBar({
    category = "NAV",
    active = false,
    children,
}: SideBarProps) {
    const [open, setOpen] = useState(false);
    const positionInfo = PositionMap[category];

    useLayoutEffect(() => {
        const cellId = `${category.toLowerCase()}-grid-cell`;
        const gridCell = document.getElementById(cellId);
        if (!gridCell) return;

        if (!active || !children || !hasSlotReact(children)) {
            console.log(`${category} collapsed`);
            gridCell.classList.toggle("collapse");
            return;
        } else {
            // can only be open on load if not mobile
            setOpen(active && window.screen.width > 768);
        }
    }, []);

    return (
        <nav
            className={`${open ? "absolute z-20 w-screen border md:relative md:w-auto" : "w-0"} bg-white ${positionInfo["absolutePosition"]} transition-default-10 h-full`}
        >
            <button
                className={`absolute z-0 h-4 w-4 text-[8px] outline hover:underline ${positionInfo["absolutePosition"]}`}
                onClick={() => setOpen(!open)}
            >
                {open ? positionInfo["arrowShow"] : positionInfo["arrowHide"]}
            </button>
            {open && (
                <div className="m-4 overflow-x-scroll md:max-w-[20vw]">
                    {children}
                </div>
            )}
        </nav>
    );
}
