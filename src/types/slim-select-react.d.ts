declare module "slim-select/react" {
    import * as React from "react";

    export type SlimSelectValue = string | string[];

    export interface SlimSelectReactProps {
        value?: SlimSelectValue;
        onChange?: (value: SlimSelectValue) => void;
        data?: unknown[];
        settings?: Record<string, unknown>;
        events?: Record<string, unknown>;
        multiple?: boolean;
        disabled?: boolean;
        className?: string;
        children?: React.ReactNode;
    }

    const SlimSelect: React.ComponentType<SlimSelectReactProps>;
    export default SlimSelect;
}
