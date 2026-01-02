import { useState, useEffect, useLayoutEffect } from "react";
import { hasSlotReact } from "@/lib/hasSlot";
import { type SidebarType } from "@/lib/handleSideBarState";

interface SideBarProps {
    type: SidebarType;
    active: boolean;
    children?: any;
}

export default function SideBar({ type, active, children }: SideBarProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!active || !hasSlotReact(children)) return; /* stay hidden if not active or valid */

        const app = document.getElementById("app");
        if (!app) return;

        /* set up mutation observer for `data-${type}state` to track open state */
        const attrName = `data-${type}state`;

        // initialize state on load
        setOpen(app.getAttribute(attrName) === "open");
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === "attributes" && m.attributeName === attrName) {
                    setOpen(app.getAttribute(attrName) === "open");
                }
            }
        });

        observer.observe(app, { attributes: true, attributeFilter: [attrName] });
    }, []);

    return (
        <div
            className={`absolute w-screen transition-[max-width] duration-1000 md:relative md:w-auto ${open ? "z-20 max-w-screen md:max-w-[40vw]" : "z-5 max-w-0"} bg-primary-neutral ${type == "nav" ? "left-0 md:rounded-r-sm" : "right-0 md:rounded-l-sm"} h-full overflow-x-visible pt-8 pb-4 shadow-lg`}
            onClick={() => {
                if (window.innerWidth <= 768) {
                    setOpen(false);
                }
            }}
        >
            <div
                className={`mx-4 h-full overflow-x-scroll md:max-w-[30vw] ${open ? "" : "opacity-0"} transition-opacity duration-500`}
            >
                <div className="size-full">{children}</div>
            </div>
        </div>
    );
}
