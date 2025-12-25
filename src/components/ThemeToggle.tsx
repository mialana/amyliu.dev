import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    // Initialize theme once on mount
    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null;

        if (saved === "light" || saved === "dark") {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
            return;
        }

        // No saved preference, so use system
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        const initialTheme: Theme = prefersDark ? "dark" : "light";

        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
        localStorage.setItem("theme", initialTheme);
    }, []);

    // Apply changes when user toggles
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handler = () => {
            const nextTheme: Theme = media.matches ? "dark" : "light";
            setTheme(nextTheme);
            document.documentElement.setAttribute("data-theme", nextTheme);
        };

        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, []);

    return (
        <button
            onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
            className="bg-tertiary cursor-pointer rounded-md border px-2 py-1 text-sm hover:brightness-125"
            aria-label="Toggle color theme"
        >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
    );
}
