import { useEffect, useRef } from "react";
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

const resetNativeSelect = (el: HTMLSelectElement) => {
    el.selectedIndex = -1;
    [...el.options].forEach((opt) => {
        opt.selected = false;
    });
};

export default function ProjectsSelect() {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const choicesRef = useRef<Choices | null>(null);

    useEffect(() => {
        const el = selectRef.current;
        if (!(el instanceof HTMLSelectElement)) return;

        resetNativeSelect(el); // form-caching is not necessary here

        const choices = new Choices(el, { searchEnabled: false, removeItemButton: true, shouldSort: true });

        choicesRef.current = choices;

        ["addItem", "removeItem"].forEach((changeEvent) => {
            choices.passedElement.element.addEventListener(changeEvent, (e) => {
                if (!isChoicesEvent(e)) return; // to appease ts

                if (e.type === "addItem") {
                    const value: string = e.detail.value;
                    enforceOneItemPerGroup(choices, value);
                }

                filterProjectCards(choices);
            });
        });

        return () => {
            choices.destroy();
            choicesRef.current = null;
        };
    }, []);

    return (
        <div
            id="projects-select-body"
            className="gap-3xl desktop:gap-sm desktop:flex-col bg-primary-shade desktop:bg-primary-neutral flex p-2"
        >
            <div className="desktop:block prose text-2xs hidden">
                <h1>Projects Selection</h1>
            </div>
            <select ref={selectRef} id={PROJECT_SELECT_ELEMENT_CLASSNAME} multiple>
                <optgroup label="Type">
                    <option value="type:solo">Solo</option>
                    <option value="type:team">Team</option>
                </optgroup>

                <optgroup label="Category">
                    <option value="category:personal">Personal</option>
                    <option value="category:research">Research</option>
                    <option value="category:internship">Internship</option>
                    <option value="category:school">School</option>
                </optgroup>
            </select>
        </div>
    );
}
