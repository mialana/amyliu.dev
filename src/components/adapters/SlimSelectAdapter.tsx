import { useEffect, useRef } from "react";
import SlimSelect, { type Config } from "slim-select";

export interface SlimSelectAdapterProps {
    multiple?: boolean;
    settings?: Config["settings"];
    cssClasses?: Config["cssClasses"];
    events?: Config["events"];
    onReady?: (instance: SlimSelect) => void;
    children: React.ReactNode;
}

export default function SlimSelectAdapter({
    multiple,
    settings,
    cssClasses,
    events,
    onReady,
    children,
}: SlimSelectAdapterProps) {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const instanceRef = useRef<SlimSelect | null>(null);

    useEffect(() => {
        if (!selectRef.current) return;

        const instance = new SlimSelect({ select: selectRef.current, settings, cssClasses, events });

        instanceRef.current = instance;
        onReady?.(instance);

        return () => {
            instance.destroy();
            instanceRef.current = null;
        };
    }, []);

    return (
        <select ref={selectRef} multiple={multiple}>
            {children}
        </select>
    );
}
