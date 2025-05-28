import type { AstroGlobal } from "astro";

interface ReactSlotProps {
    props: { value: string };
}

export function hasSlotReact(react_slot?: ReactSlotProps) {
    if (!react_slot) return false;
    return !!react_slot.props.value.trim().length;
}

export async function hasSlotAstro(
    slots: AstroGlobal["slots"],
    name: string = "default",
) {
    const renderedContent = await slots.render(name);
    return !!renderedContent?.trim().length;
}
