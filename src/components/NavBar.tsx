import "../styles/global.css";

import { useState, useEffect } from "react";
import headshot from "../assets/png/headshot-2025-v1.png";

export default function NavBar() {
    const [open, setOpen] = useState(false);

    // Shift the main content whenever the nav opens/closes
    useEffect(() => {
        const main = document.querySelector('main');
        if (!main) return;
        main.classList.toggle("ml-[312px]", open);
        main.classList.toggle("ml-0", !open);
    }, [open]);

    return (
        <>
            <nav
                className={`bg-wanderer-300 fixed top-0 left-0 z-10 h-full w-[312px] transform space-y-8 px-8 py-12 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <a
                    href="/"
                    className="font-signature text-wanderer-100 flex justify-center text-[2.5rem] font-extrabold transition hover:scale-[101%]"
                >
                    Amy M. Liu
                </a>

                <div className="mx-4 overflow-hidden">
                    <img
                        src={headshot.src}
                        alt="headshot"
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>

                <ul className="space-y-4 font-medium">
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
                className="bg-wanderer-300 text-wanderer-100 fixed top-4 left-4 z-20 rounded p-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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
