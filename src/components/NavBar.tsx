import "../styles/global.css";

import { useState, useEffect, useLayoutEffect } from "react";

export default function NavBar() {
    const [open, setOpen] = useState(false);

    function SyncBackgroundWidth() {
        const img = document.getElementById("headshot");
        const bg = document.getElementById("left-bg");
        if (!img || !bg) return;

        const rect = img.getBoundingClientRect();
        // distance from viewport left edge to img centre
        const newWidth = rect.left + rect.width / 2;
        bg.style.width = `${newWidth}px`;
    }

    useEffect(() => {
        // Run once on initial load
        SyncBackgroundWidth();

        // Attach listeners for resizing
        window.addEventListener("resize", SyncBackgroundWidth);

        return () => {
            window.removeEventListener("resize", SyncBackgroundWidth);
        };
    }, []);

    // Shift the main content whenever the nav opens/closes
    useLayoutEffect(() => {
        const navbar = document.getElementById("navbar-container");

        const main = document.querySelector("main");
        if (!main || !navbar) return;

        const isLg = window.innerWidth >= 1024;

        const rect = navbar.getBoundingClientRect();
        main.style.marginLeft = isLg && open ? `${rect.right}px` : "0px";

        SyncBackgroundWidth();

        // kick-off a per-frame loop while the transition is running
        let rafId: number;
        const tick = () => {
            SyncBackgroundWidth(); // update this frame
            rafId = requestAnimationFrame(tick);
        };
        main.addEventListener("transitionstart", tick); // start immediately

        // stop the loop when the CSS transition finishes
        const end = (e: TransitionEvent) => {
            if (e.propertyName === "margin-left") {
                cleanup();
            }
        };

        main.addEventListener("transitionend", end);

        const cleanup = () => {
            cancelAnimationFrame(rafId);
            main.removeEventListener("transitionstart", tick);
            main.removeEventListener("transitionend", end);
        };

        // tidy up if the component unmounts early
        return () => {
            cleanup();
        };
    }, [open]);

    return (
        /* navigation container */
        <div
            id="navbar-container"
            className={`fixed inset-y-2 left-[2vw] z-2 h-auto w-[192dvw] -translate-x-1/2 items-center lg:left-2 lg:w-[624px] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        >
            <nav
                className={`bg-wanderer-shadow drop-shadow-nav transition-default-300 absolute h-full w-1/2 rounded-lg ${open ? "left-1/2" : "left-0"}`}
            >
                {/* list container */}
                <div className="absolute inset-8 my-8">
                    <ul className="text-wanderer-highlight text-center text-xl/loose font-medium *:hover:underline">
                        <li>
                            <a href="#landing">Landing</a>
                        </li>
                        <li>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <a href="#projects">Projects</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="absolute inset-y-4 left-1/2 z-3 translate-x-4">
                <button
                    id="navigation-button"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className={`${open ? "bg-wanderer-highlight text-wanderer-shadow" : "bg-wanderer-shadow text-wanderer-highlight"} drop-shadow-button transition-default-300 pointer-events-auto cursor-pointer rounded-2xl p-2 active:translate-y-[4px]`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6 h16 M4 12 h16 M4 18 h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
