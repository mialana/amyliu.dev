import Choices from "choices.js";

const PROJECT_SELECT_ELEMENT_CLASSNAME = "choices-projects-select";

type ChoicesEventDetail = { id: number; value: string; label: string; customProperties?: unknown; groupValue?: string };
type ChoicesEvent = CustomEvent<ChoicesEventDetail>;

const isChoicesEvent = (e: Event): e is ChoicesEvent =>
    e instanceof CustomEvent && typeof (e as CustomEvent).detail?.value === "string";

const getTocItemForCard = (card: HTMLUListElement): HTMLUListElement | null => {
    const id = card.id;
    // the `data-slug` attribute of TOC items matches the `id` attribute of project cards
    return document.querySelector<HTMLUListElement>(`.toc-item[data-slug="${id}"]`);
};

// show card and toc item
const changeProjectDisplay = (card: HTMLUListElement | null, display: "block" | "none") => {
    if (!card) return;

    card.style.display = display;

    const tocItem = getTocItemForCard(card);
    if (tocItem) {
        tocItem.style.display = display;
    }
};

const getSelectedValues = (choices: Choices): string[] => {
    const value = choices.getValue(true);
    if (Array.isArray(value)) return value;
    return [];
};

const buildSelector = (values: string[]) => {
    if (values.length === 0) return ".project-card";

    const constraints = values.map((value) => {
        const [identifier, val] = value.split(":");
        return `[data-${identifier}^="${val}"]`;
    });

    return `.project-card${constraints.join("")}`;
};

const filterProjectCards = (choices: Choices) => {
    const values: string[] = getSelectedValues(choices);

    const selector = buildSelector(values);
    const matchingCards = new Set(document.querySelectorAll<HTMLUListElement>(selector));

    const allCards = document.querySelectorAll<HTMLUListElement>(".project-card");

    allCards.forEach((card) => {
        changeProjectDisplay(card, matchingCards.has(card) ? "block" : "none");
    });
};

const enforceOneItemPerGroup = (choices: Choices, addedValue: string) => {
    // extract group identifier (i.e. "type", "category")
    const addedGroup = addedValue.split(":")[0];

    // get currently selected items
    const selected = choices.getValue() as { value: string }[];

    // find other items from the same group
    const toRemove = selected.filter((item) => item.value !== addedValue && item.value.startsWith(`${addedGroup}:`));

    // remove them from the choices element
    toRemove.forEach((item) => {
        choices.removeActiveItemsByValue(item.value);
    });
};

export const resetNativeSelect = (el: HTMLSelectElement) => {
    el.selectedIndex = -1;
    [...el.options].forEach((opt) => {
        opt.selected = false;
    });
};

const positionDropdown = (choices: Choices) => {
    const root = choices.containerOuter?.element;
    if (!root) return;

    const inner = root.querySelector(".choices__inner") as HTMLElement | null;
    const dropdown = root.querySelector(".choices__list--dropdown") as HTMLElement | null;

    if (!inner || !dropdown) return;
    dropdown.style.position = "fixed";

    const rect = inner.getBoundingClientRect();

    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
};

export function initializeChoices() {
    const el = document.getElementById(PROJECT_SELECT_ELEMENT_CLASSNAME) as HTMLSelectElement | null;
    if (!(el instanceof HTMLSelectElement)) return;

    // form-caching can be disabled here
    resetNativeSelect(el);

    const choices = new Choices(el, { removeItemButton: true, position: "bottom", noChoicesText: "choose" });

    ["addItem", "removeItem"].forEach((changeEvent) => {
        el.addEventListener(changeEvent, (e) => {
            if (!isChoicesEvent(e)) return; // to appease ts
            if (e.type === "addItem") {
                const value: string = e.detail.value;
                enforceOneItemPerGroup(choices, value);
            }

            filterProjectCards(choices);
            positionDropdown(choices);
        });
    });

    // set up resize listener
    positionDropdown(choices);
    window.addEventListener("resize", () => positionDropdown(choices));
}
