import "../styles/global.css";

import { useState, useEffect } from "react";

export function syncBackgroundWidth() {
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
    useEffect(() => {
        const main = document.querySelector("main");
        if (!main) return;
        main.classList.toggle("lg:ml-[312px]", open);
        main.classList.toggle("lg:ml-0", !open);
        syncBackgroundWidth();

        // kick-off a per-frame loop while the transition is running
        let rafId: number;
        const tick = () => {
            syncBackgroundWidth(); // update this frame
            rafId = requestAnimationFrame(tick);
        };
        tick(); // start immediately

        // stop the loop when the CSS transition finishes
        const end = (e: TransitionEvent) => {
            if (e.propertyName === "margin-left") {
                cancelAnimationFrame(rafId);
                syncBackgroundWidth();
                main.removeEventListener("transitionend", end);
            }
        };
        main.addEventListener("transitionend", end);

        // tidy up if the component unmounts early
        return () => {
            cancelAnimationFrame(rafId);
            main.removeEventListener("transitionend", end);
        };
    }, [open]);

    return (
        /* navigation container */
        <div className="flex min-h-screen items-center">
            <nav
                className={`bg-wanderer-shadow drop-shadow-nav fixed left-1 z-30 h-[calc(100vh-10*var(--spacing))] w-[312px] transform rounded-lg px-8 py-10 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* list container */}
                <div className="my-8 flex">
                    <ul className="text-wanderer-highlight space-y-4 font-bold">
                        <li>
                            <a href="#landing" className="hover:underline">
                                Landing
                            </a>
                        </li>
                        <li>
                            <a href="#projects" className="hover:underline">
                                Projects
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <button
                aria-label="Toggle navigation"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className={`${open ? "bg-wanderer-highlight text-wanderer-shadow" : "bg-wanderer-shadow text-wanderer-highlight"} drop-shadow-button fixed top-8 left-4 z-40 transform cursor-pointer rounded-2xl p-2 transition-all duration-300 ease-in-out active:translate-y-[4px]`}
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
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
        </div>
    );
}
