import "@/styles/global.css";
import { useState, useLayoutEffect } from "react";
import { PositionMap } from "@/lib/Maps";

interface SideBarProps {
    label: string;
    position: keyof typeof PositionMap;
    active?: boolean;
    children: any;
}

export default function SideBar({
    label,
    position,
    children,
    active = false,
}: SideBarProps) {
    const [open, setOpen] = useState(false);
    const positionInfo = PositionMap[position];

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
                    <div className="overflow-x-scroll px-1 py-4 text-xs leading-relaxed text-nowrap **:border-neutral-200 md:max-w-[20vw]">
                        {children}
                    </div>
                </div>
            )}
        </nav>
    );
}
