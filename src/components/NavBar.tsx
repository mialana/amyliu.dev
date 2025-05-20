import "../styles/global.css";

import { useState, useLayoutEffect } from "react";

export function SyncBackgroundWidth() {
    const img = document.getElementById("headshot");
    const bg = document.getElementById("left-bg");
    if (!img || !bg) return;

    const rect = img.getBoundingClientRect();
    // distance from viewport left edge to img centre
    const newWidth = rect.left + rect.width / 2;
    bg.style.width = `${newWidth}px`;
}

export default function NavBar() {
    const [open, setOpen] = useState(false);

    // Shift the main content whenever the nav opens/closes
    useLayoutEffect(() => {
        const main = document.querySelector("main");
        if (!main) return;
        main.classList.toggle("lg:ml-[312px]", open);
        main.classList.toggle("lg:ml-0", !open);
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
        }

        // tidy up if the component unmounts early
        return () => {
            cleanup();
        };
    }, [open]);

    return (
        /* navigation container */
        <div className="fixed inset-y-2 left-2 z-30 flex items-center">
            <nav
                className={`bg-wanderer-shadow drop-shadow-nav transition-default-300 absolute h-full w-[312px] rounded-lg ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* list container */}
                <div className="absolute inset-8 my-8">
                    <ul className="text-wanderer-highlight font-medium text-center text-xl/loose *:hover:underline">
                        <li>
                            <a href="#landing">
                                Landing
                            </a>
                        </li>
                        <li>
                            <a href="#about">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#projects">
                                Projects
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="absolute inset-4 z-40">
                <button
                    id="navigation-button"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className={`${open ? "bg-wanderer-highlight text-wanderer-shadow" : "bg-wanderer-shadow text-wanderer-highlight"} drop-shadow-button transition-default-300 cursor-pointer rounded-2xl p-2 active:translate-y-[4px]`}
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
