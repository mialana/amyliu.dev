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
        const main = document.querySelector('main');
        if (!main) return;
        main.classList.toggle("ml-[312px]", open);
        main.classList.toggle("ml-0", !open);
        syncBackgroundWidth();

        // kick-off a per-frame loop while the transition is running
        let rafId: number;
        const tick = () => {
            syncBackgroundWidth();            // update this frame
            rafId = requestAnimationFrame(tick);
        };
        tick();                             // start immediately

        // stop the loop when the CSS transition finishes
        const end = (e: TransitionEvent) => {
            if (e.propertyName === 'margin-left') {
            cancelAnimationFrame(rafId);
            syncBackgroundWidth();
            main.removeEventListener('transitionend', end);
            }
        };
        main.addEventListener('transitionend', end);

        // tidy up if the component unmounts early
        return () => {
            cancelAnimationFrame(rafId);
            main.removeEventListener('transitionend', end);
        };
    }, [open]);

    return (
        <>
            <nav
                className={`bg-wanderer-shadow drop-shadow-nav fixed rounded-lg left-1 z-10 h-[calc(100vh-10*var(--spacing))] py-10 top-1/2 -translate-y-1/2 w-[312px] transform space-y-8 px-8 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <ul className="text-wanderer-highlight space-y-4 font-bold my-8">
                    <li>
                        <a href="#about" className="hover:underline">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#projects" className="hover:underline">
                            Projects
                        </a>
                    </li>
                </ul>
            </nav>

            <button
                aria-label="Toggle navigation"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className={`${open ? "bg-wanderer-highlight text-wanderer-shadow" : "bg-wanderer-shadow text-wanderer-highlight"} fixed cursor-pointer drop-shadow-button top-8 left-4 z-20 rounded-2xl p-2 transform transition-all duration-300 ease-in-out active:translate-y-[4px]`}
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
        </>
    );
}
