import { stringToBoolean, getRequiredElements, getAriaControlsElements } from "@/lib/utils";

export type SideBarType = "nav" | "aside";

function handleSideBarButtonClicked(button: HTMLButtonElement, sidebar: Element) {
    console.log({ button })
    const currExpanded: boolean = stringToBoolean(button.ariaExpanded);
    button.ariaExpanded = String((!currExpanded));
    sidebar.ariaHidden = String(currExpanded); // `aria-hidden` is opposite of `aria-expanded`
}

let sidebarAbort: AbortController | null = null;
export function initializeSideBarButtonBehavior() {
    sidebarAbort?.abort(); // `abort` removes all event listeners with this abort signal
    sidebarAbort = new AbortController();

    const buttons = getRequiredElements("button[id*=sidebar-button]", HTMLButtonElement);

    buttons.forEach((button) => {
        const sidebar = getAriaControlsElements(button)[0];
        button.addEventListener(
            "click",
            () => handleSideBarButtonClicked(button, sidebar),
            { signal: sidebarAbort!.signal }
        );
    });
}
