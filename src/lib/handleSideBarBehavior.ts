import { stringToBoolean, getRequiredElements, getAriaControlsElements } from "@/lib/utils";

export type SideBarType = "nav" | "aside";

function handleSideBarButtonClicked(button: HTMLButtonElement, sidebar: Element) {
    const currExpanded: boolean = stringToBoolean(button.ariaExpanded);
    button.ariaExpanded = (!currExpanded).toString()
    sidebar.ariaHidden = currExpanded.toString() // `aria-hidden` is opposite of `aria-expanded`
}

export function initializeSideBarButtonBehavior() {
    const buttons = getRequiredElements("button[id*=sidebar-button]", HTMLButtonElement)

    buttons.forEach((button) => {
        const sidebar = getAriaControlsElements(button)[0]
        button.addEventListener("click", () => handleSideBarButtonClicked(button, sidebar));
    });
}
