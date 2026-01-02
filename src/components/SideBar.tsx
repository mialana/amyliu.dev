import { useState, useEffect } from "react";
import { type SideBarType, checkIfMobile } from "@/lib/handleSideBarState";

interface SideBarProps {
    sideBarType: SideBarType;
    active: boolean;
    children?: React.ReactNode;
}

export function MobileSideBar({ sideBarType, active, children }: SideBarProps) {
    return <div className={`relative overflow-clip`}>{children}</div>;
}

export function DesktopSideBar({ sideBarType, active, children }: SideBarProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!active) return; /* stay hidden if not active or valid */

        const app = document.getElementById("app");
        if (!app) return;

        /* set up mutation observer for `data-${type}state` to track open state */
        const attrName = `data-${sideBarType}state`;

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
        return () => observer.disconnect();
    }, [sideBarType, active]);

    return (
        <aside
            className={`h-full overflow-x-clip overflow-y-scroll transition-[max-width] ${open ? "max-w-xs" : "max-w-0"}`}
        >
            {children}
        </aside>
    );
}

export default function SideBar(props: SideBarProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => {
            setIsMobile(checkIfMobile());
        };

        onResize(); // set up initial state
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

    return isMobile ? <MobileSideBar {...props} /> : <DesktopSideBar {...props} />;
}
