import Choices from "choices.js";

const PROJECTS_SELECT_ELEMENT_CLASSNAME = "choices-projects-select";
const CHOICES_DROPDOWN_ELEMENT_SELECTOR = ".choices__list--dropdown";
const CHOICES_EXTRA_ELEMENT_CLASSNAME = "choices-extra-content-container";

type ChoicesEventDetail = { id: number; value: string; label: string; customProperties?: unknown; groupValue?: string };
type ChoicesEvent = CustomEvent<ChoicesEventDetail>;

function bifilter<T>(f: (x: T, i: number, arr: T[]) => boolean, xs: T[]): [T[], T[]] {
    return xs.reduce<[T[], T[]]>(
        ([Tarr, Farr], x, i, arr) => {
            if (f(x, i, arr)) Tarr.push(x);
            else Farr.push(x);
            return [Tarr, Farr];
        },
        [[], []],
    );
}

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

const positionDropdown = (choices: Choices, mobileMediaQuery: MediaQueryList) => {
    const root = choices.containerOuter?.element;
    if (!root) return;

    const inner = root.querySelector(".choices__inner") as HTMLElement | null;
    const dropdown = root.querySelector(CHOICES_DROPDOWN_ELEMENT_SELECTOR) as HTMLElement | null;

    if (!inner || !dropdown) return;

    const isMobile: boolean = mobileMediaQuery.matches;

    dropdown.style.position = isMobile ? "fixed" : "absolute";

    const rect = inner.getBoundingClientRect();

    dropdown.style.top = isMobile ? `${rect.bottom}px` : `${rect.height}px`;
    dropdown.style.left = isMobile ? `${rect.left}px` : "0px";
    dropdown.style.width = `${rect.width}px`;
};

function appendExtraElementToDropdown(root: HTMLElement) {
    const dropdown = root.querySelector(CHOICES_DROPDOWN_ELEMENT_SELECTOR);
    if (!dropdown) return;

    // element already appended
    if (dropdown.querySelector(`#${CHOICES_EXTRA_ELEMENT_CLASSNAME}`)) return;

    const template = document.getElementById(CHOICES_EXTRA_ELEMENT_CLASSNAME);
    if (!template) return;

    const clone = template.cloneNode(true) as HTMLElement;
    clone.classList.remove("hidden");

    dropdown.appendChild(clone);
}

// attach on open, remove on close
const onDropdownOpenScoped = (choices: Choices, scrollableAncestor: string, mobileMediaQuery: MediaQueryList) => {
    const root = choices.containerOuter?.element;
    if (!root) return;

    appendExtraElementToDropdown(root);

    const onPointerDown = (e: Event) => {
        if (e.target instanceof Node && !root.contains(e.target)) {
            choices.hideDropdown();
        }
    };
    const positionDropdownFn = () => positionDropdown(choices, mobileMediaQuery);

    // set up listeners
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", positionDropdownFn);

    const cleanup = () => {
        document.removeEventListener("pointerdown", onPointerDown);
        root.removeEventListener("hideDropdown", cleanup);
    };

    root.addEventListener("hideDropdown", cleanup);
};

export function initializeChoices(scrollableAncestor: string) {
    const srcSelectEl = document.getElementById(PROJECTS_SELECT_ELEMENT_CLASSNAME) as HTMLSelectElement | null;
    if (!(srcSelectEl instanceof HTMLSelectElement)) return;

    // form-caching can be disabled here
    resetNativeSelect(srcSelectEl);

    const choices = new Choices(srcSelectEl, {
        removeItemButton: true,
        position: "bottom",
        itemSelectText: "Select ≤ 1 per group",
        shouldSort: false,
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
    });

    const mobileMediaQuery = window.matchMedia(
        `(max-width: ${getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-desktop").trim()})`,
    );

    // add event listeners for when new choices are added or removed
    ["addItem", "removeItem"].forEach((changeEvent) => {
        srcSelectEl.addEventListener(changeEvent, (e) => {
            if (!isChoicesEvent(e)) return; // to appease ts
            if (e.type === "addItem") {
                const value: string = e.detail.value;
                enforceOneItemPerGroup(choices, value);
            }

            filterProjectCards(choices);
            positionDropdown(choices, mobileMediaQuery);
        });
    });

    // set up listener to close choices dropdown when a click/ scroll is detected outside of the element
    const root = choices.containerOuter?.element;
    if (!root) return;

    root.addEventListener("showDropdown", () => {
        onDropdownOpenScoped(choices, scrollableAncestor, mobileMediaQuery);
        positionDropdown(choices, mobileMediaQuery);
    });
}
