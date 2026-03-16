import Choices, { type Options } from "choices.js";
import { getRequiredElement, capitalize } from "../utils";

const PROJECTS_SELECT_ORIGIN_ID = "projects-select--origin";
const PROJECTS_SELECT_EXTRA_CONTAINER_ID = "projects-select__extra--container";

// ensure classNames are always consistent
const CHOICES_DROPDOWN_CLASSNAME = "choices__list--dropdown";
const CHOICES_HEADING_CLASSNAME = "choices__heading";

type ChoicesEventDetail = { id: number; value: string; label: string; customProperties?: unknown; groupValue?: string };
type ChoicesEvent = CustomEvent<ChoicesEventDetail>;

const projectsSelectGroupArray = ["category", "type"] as const;
type ProjectsSelectGroup = (typeof projectsSelectGroupArray)[number];

const choicesOptions: Partial<Options> = {
    removeItemButton: true,
    position: "bottom",
    shouldSort: false,
    classNames: {
        ...Choices.defaults.allOptions.classNames,
        groupHeading: CHOICES_HEADING_CLASSNAME,
        listDropdown: CHOICES_DROPDOWN_CLASSNAME,
    },
    /* override templates to copy all data attributes from original `option` element to new element */
    callbackOnCreateTemplates: function () {
        const defaults = Choices.defaults.templates;
        return {
            choice: (...args) => {
                const newEl = defaults.choice.call(this, ...args);

                const [, srcChoice] = args;
                const srcEl = srcChoice.element;

                if (!srcEl) return newEl;

                for (const key in srcEl.dataset) {
                    if (Object.hasOwn(srcEl.dataset, key)) {
                        newEl.dataset[key] = srcEl.dataset[key];
                    }
                }

                return newEl;
            },
        };
    },
};

const isChoicesEvent = (e: Event): e is ChoicesEvent =>
    e instanceof CustomEvent && typeof (e as CustomEvent).detail?.value === "string";

const isProjectsSelectGroup = (s: string): s is ProjectsSelectGroup => projectsSelectGroupArray.includes(s as any);

const getSelectedChoices = (choices: Choices): string[] => {
    const choice = choices.getValue(true);
    if (Array.isArray(choice)) return choice;
    return [];
};

const buildMapForSelected = (selected: string[]) => {
    const selectedMap: Map<ProjectsSelectGroup, string[]> = new Map(projectsSelectGroupArray.map((grp) => [grp, []]));
    selected.forEach((choice) => {
        const [grp, val] = choice.split(":");
        if (isProjectsSelectGroup(grp)) {
            selectedMap.get(grp)?.push(val);
        }
    });
    return selectedMap;
};

function updateAppDataset(selected: string[]) {
    const app = document.getElementById("app");
    if (!app) return;

    buildMapForSelected(selected)
        .entries()
        .forEach(([grp, selectedInGrp]) => {
            const attribName = `projectSelected${capitalize(grp)}`;
            const attribValue = selectedInGrp.join(":");
            app.dataset[attribName] = attribValue;
        });
}

const enforceOneItemPerGroup = (addedChoice: string, selected: string[], choices: Choices) => {
    const [addedGroup] = addedChoice.split(":");

    // find other items from the same group
    const conflicting = selected.filter((choice) => choice !== addedChoice && choice.startsWith(`${addedGroup}:`));

    // remove them from the `Choices` element
    conflicting.forEach((choice: string) => {
        choices.removeActiveItemsByValue(choice);
    });
    return getSelectedChoices(choices);
};

export const resetNativeSelect = (el: HTMLSelectElement) => {
    el.selectedIndex = -1;
    [...el.options].forEach((opt) => {
        opt.selected = false;
    });
};

function appendExtraElementToDropdown(root: HTMLElement) {
    const dropdown = root.querySelector(`.${CHOICES_DROPDOWN_CLASSNAME}`);
    if (!dropdown) return;

    // element already appended
    if (dropdown.querySelector(`#${PROJECTS_SELECT_EXTRA_CONTAINER_ID}`)) return;

    const template = getRequiredElement(`#${PROJECTS_SELECT_EXTRA_CONTAINER_ID}`);

    const clone = template.cloneNode(true) as HTMLElement;
    clone.classList.remove("hidden");

    dropdown.appendChild(clone);
}

// attach events on open, remove those events on close
const onDropdownOpenScoped = (choices: Choices) => {
    const root = choices.containerOuter?.element;
    if (!root) return;

    appendExtraElementToDropdown(root);

    const onPointerDown = (e: Event) => {
        if (e.target instanceof Node && !root.contains(e.target)) {
            choices.hideDropdown();
        }
    };

    // set up scoped listening
    document.addEventListener("pointerdown", onPointerDown);
    const cleanup = () => {
        document.removeEventListener("pointerdown", onPointerDown);
        root.removeEventListener("hideDropdown", cleanup);
    };
    root.addEventListener("hideDropdown", cleanup);
};

export function initializeChoices() {
    const origin = getRequiredElement<HTMLSelectElement>(`#${PROJECTS_SELECT_ORIGIN_ID}`);

    // form-caching overriden here
    resetNativeSelect(origin);

    let choices = new Choices(origin, choicesOptions);

    // add event listeners for when new choices are added or removed
    ["addItem", "removeItem"].forEach((changeEvent) => {
        origin.addEventListener(changeEvent, (e) => {
            if (!isChoicesEvent(e)) return; // to appease ts
            let selected = getSelectedChoices(choices);
            if (e.type === "addItem") {
                const addedChoice: string = e.detail.value;
                selected = enforceOneItemPerGroup(addedChoice, selected, choices);
            }
            updateAppDataset(selected);
        });
    });

    // set up listener to close choices dropdown when a click/ scroll is detected outside of the element
    const root = choices.containerOuter?.element;
    if (!root) return;

    root.addEventListener("showDropdown", () => {
        onDropdownOpenScoped(choices);
    });
}
