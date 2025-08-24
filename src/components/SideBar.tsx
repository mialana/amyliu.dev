import "@/styles/global.css";
import { useState, useLayoutEffect } from "react";
import { hasSlotReact } from "@/lib/hasSlot";

const ArrowLeft = ({ size = 12 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
);

const ArrowRight = ({ size = 12 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
);

const PositionMap = {
    NAV: {
        absolutePosition: "left-0",
        arrowShow: <ArrowLeft />,
        arrowHide: <ArrowRight />,
    },
    ASIDE: {
        absolutePosition: "right-0",
        arrowShow: <ArrowRight />,
        arrowHide: <ArrowLeft />,
    },
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
        if (!active || !hasSlotReact(children)) {
            const cellId = `${category.toLowerCase()}-grid-cell`;
            const gridCell = document.getElementById(cellId);

            gridCell?.classList.toggle("collapse");
            console.log(`${category} collapsed`);
            return;
        } else {
            // can only be open on load if not mobile
            setOpen(active && window.screen.width > 768);

            if (active) {
                const button = document.getElementById(`${category}-button`);
                button?.classList.remove("invisible");
            }
        }
    }, []);

    return (
        <div
            className={`${open ? "absolute z-20 w-screen md:relative md:w-auto" : "w-0"} bg-white ${category == "NAV" ? "left-0" : "right-0"} h-full overflow-scroll py-4 shadow-lg`}
        >
            {/* sidebar button */}
            <button
                id={`${category}-button`}
                className={`invisible absolute top-0 z-0 flex h-4 w-4 cursor-pointer items-center justify-center text-[8px] text-neutral-500 ${positionInfo["absolutePosition"]}`}
                onClick={() => setOpen(!open)}
                title={`${open ? "Close" : "Open"} ${category}`}
            >
                <svg
                    className={`${(category === "NAV") === open ? "rotate-180" : ""}`}
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
            </button>
            {open && (
                <div className="mx-4 h-full overflow-x-scroll md:max-w-[30vw]">
                    <div className="size-full">{children}</div>
                </div>
            )}
        </div>
    );
}
