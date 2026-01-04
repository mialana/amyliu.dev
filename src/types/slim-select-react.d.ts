declare module "slim-select/react" {
    import * as React from "react";
    import type SlimSelectCore from "slim-select";

    export interface SlimSelectRef {
        slimSelect: SlimSelectCore;
    }

    export interface SlimSelectProps {
        value?: string | string[];
        onChange?: (value: string | string[]) => void;
        data?: unknown[];
        settings?: Record<string, unknown>;
        events?: Record<string, unknown>;
        multiple?: boolean;
        disabled?: boolean;
        className?: string;
        children?: React.ReactNode;
    }

    const SlimSelect: React.ForwardRefExoticComponent<SlimSelectProps & React.RefAttributes<SlimSelectRef>>;

    export default SlimSelect;
}
