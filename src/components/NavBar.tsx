import "../styles/global.css";

import { useState, useEffect, useLayoutEffect } from "react";

export default function NavBar() {
    const [open, setOpen] = useState(false);

    // function SyncBackgroundWidth() {
    //     const img = document.getElementById("headshot");
    //     const bg = document.getElementById("left-bg");
    //     if (!img || !bg) return;

    //     const rect = img.getBoundingClientRect();
    //     // distance from viewport left edge to img centre
    //     const newWidth = rect.left + rect.width / 2;
    //     bg.style.width = `${newWidth}px`;
    // }

    useEffect(() => {
        const toggle = () => setOpen((prev) => !prev);

        // Run once on initial load
        // SyncBackgroundWidth();

        // Attach listeners for resizing
        window.addEventListener("toggle-navbar", toggle);
        // window.addEventListener("resize", SyncBackgroundWidth);

        return () => {
            window.removeEventListener("toggle-navbar", toggle);
            // window.removeEventListener("resize", SyncBackgroundWidth);
        };
    }, []);

    // Shift the main content whenever the nav opens/closes
    // useLayoutEffect(() => {
    //     const navbar = document.getElementById("navbar-container");

    //     const main = document.querySelector("main");
    //     if (!main || !navbar) return;

    //     const isLg = window.innerWidth >= 1024;

    //     const rect = navbar.getBoundingClientRect();
    //     main.style.marginLeft = isLg && open ? `${rect.right}px` : "0px";

    //     SyncBackgroundWidth();

    //     // kick-off a per-frame loop while the transition is running
    //     let rafId: number;
    //     const tick = () => {
    //         SyncBackgroundWidth(); // update this frame
    //         rafId = requestAnimationFrame(tick);
    //     };
    //     main.addEventListener("transitionstart", tick); // start immediately

    //     // stop the loop when the CSS transition finishes
    //     const end = (e: TransitionEvent) => {
    //         if (e.propertyName === "margin-left") {
    //             cleanup();
    //         }
    //     };

    //     main.addEventListener("transitionend", end);

    //     const cleanup = () => {
    //         cancelAnimationFrame(rafId);
    //         main.removeEventListener("transitionstart", tick);
    //         main.removeEventListener("transitionend", end);
    //     };

    //     // tidy up if the component unmounts early
    //     return () => {
    //         cleanup();
    //     };
    // }, [open]);

    // ${!open ? "translate-x-full" : "translate-x-0" }`

    return (
        <aside>
            <nav
                className={`bg-wanderer-shadow transition-default-300 fixed top-2 right-2 z-20 h-full w-64 rounded-lg ${!open ? "translate-x-full" : "translate-x-0"}`}
            >
                {/* list container */}
                <ul className="text-wanderer-highlight my-20 text-center text-xl/loose font-medium *:hover:underline">
                    <li>
                        <a href="/#landing">Landing</a>
                    </li>
                    <li>
                        <a href="/#about">About</a>
                    </li>
                    <li>
                        <a href="/#projects">Projects</a>
                    </li>
                </ul>
            </nav>
            {open && (
                <div
                    className="fixed inset-0 z-10 h-screen w-screen bg-black/10"
                    onClick={() => setOpen(false)}
                />
            )}
        </aside>
    );
}
