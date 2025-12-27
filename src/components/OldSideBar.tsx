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
        function handleResize() {
            if (!active || !hasSlotReact(children)) {
                const cellId = `${category.toLowerCase()}-grid-cell`;
                const gridCell = document.getElementById(cellId);

                gridCell?.classList.toggle("w-0");
                console.log(`${category} collapsed`);
                return;
            } else {
                // can only be open on load if not mobile

                setOpen(active && window.innerWidth > 768);

                if (active) {
                    const button = document.getElementById(
                        `${category}-button`,
                    );
                    const buttonBar = document.getElementById(
                        `${category}-button-bar`,
                    );
                    button?.classList.remove("invisible");
                    buttonBar?.classList.remove("invisible");
                }
            }
        }

        handleResize();

        // Initial call to set dimensions on mount
        window.addEventListener("resize", handleResize);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`absolute w-screen transition-[max-width] duration-1000 md:relative md:w-auto ${open ? "z-20 max-w-screen md:max-w-[40vw]" : "z-5 max-w-0"} bg-neutral-primary ${category == "NAV" ? "left-0 md:rounded-r-sm" : "right-0 md:rounded-l-sm"} h-full overflow-x-visible pt-8 pb-4 shadow-lg`}
            onClick={() => {
                if (window.innerWidth <= 768) {
                    setOpen(false);
                }
            }}
        >
            <div
                id={`${category}-button-bar`}
                className={`invisible absolute top-0 h-4 cursor-pointer opacity-75 ${category == "NAV" ? "bg-linear-to-l" : "bg-linear-to-r"} from-secondary to-base ${positionInfo["absolutePosition"]} w-full ${category === "NAV" ? "rounded-r-xs" : "rounded-l-xs"} z-30`}
                onClick={(event) => {
                    event.stopPropagation(); // Prevent click from propagating
                    setOpen(!open);
                }}
            ></div>
            {/* sidebar button */}
            <button
                id={`${category}-button`}
                className={`invisible absolute top-0 flex h-4 w-4 cursor-pointer items-center justify-center text-[8px] ${positionInfo["absolutePosition"]}`}
                onClick={(event) => {
                    event.stopPropagation(); // Prevent click from propagating
                    setOpen(!open);
                }}
                title={`${open ? "Close" : "Open"} ${category}`}
            >
                <svg
                    className={`${(category === "NAV") === open ? "rotate-180" : ""} ${open ? "" : "animate-pulse delay-1100"} transition-all duration-300 ${open ? "z-35" : "z-25"} saturate-25`}
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    fill="currentColor"
                    stroke="currentColor"
                >
                    <path
                        d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
                        transform="translate(3, 0)"
                    />

                    <path
                        d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
                        transform="translate(-5, 0)"
                    />
                </svg>
            </button>
            <div
                className={`mx-4 h-full overflow-x-scroll md:max-w-[30vw] ${open ? "" : "opacity-0"} transition-opacity duration-500`}
            >
                <div className="size-full">{children}</div>
            </div>
        </div>
    );
}
