import { useEffect, useState } from "react";

export default function Toast() {
    const [visible, setVisible] = useState(false);
    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`pointer-none absolute top-2 right-2 z-100 w-fit max-w-screen rounded-sm bg-black px-8 py-4 text-lg text-white transition-opacity duration-500 ease-linear ${visible ? "visible" : "invisible"}`}
        >
            <div>
                <strong>NOTE: </strong>This site is currently a
                work-in-progress.
            </div>
            <div>
                <strong>LAST UPDATE: </strong>
                {today}
            </div>
            <div
                className={`absolute right-0 bottom-0 m-[2px] h-1 rounded-sm bg-white transition-[width] duration-[5000ms] ease-linear ${visible ? "visible w-0" : "invisible w-[calc(100%-4px)]"}`}
            />
        </div>
    );
}
