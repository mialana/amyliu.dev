import { useRef } from "react";

import "slim-select/styles";
import SlimSelect from "slim-select/react";
import type { Option } from "slim-select";

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

const buildSelector = (options: Option[]) => {
    if (options.length === 0) return ".project-card";

    const constraints = options.map(({ value }) => {
        const [identifier, val] = value.split(":");
        return `[data-${identifier}^="${val}"]`;
    });

    return `.project-card${constraints.join("")}`;
};

const afterChange = (options: Option[]) => {
    const selector = buildSelector(options);

    const matchingCards = new Set(document.querySelectorAll<HTMLUListElement>(selector));

    const allCards = document.querySelectorAll<HTMLUListElement>(".project-card");

    allCards.forEach((card) => {
        if (matchingCards.has(card)) {
            changeProjectDisplay(card, "block");
        } else {
            changeProjectDisplay(card, "none");
        }
    });
};

const addable = (value: string) => {
    const [identifier] = value.split(":");
};

export default function ProjectsSelect() {
    return (
        <SlimSelect
            multiple
            settings={{
                closeOnSelect: false,
                showSearch: false,
                placeholderText: "Filter Projects <span class='fa-solid fa-caret-down'></span>",
            }}
            events={{ addable: addable, afterChange: afterChange }}
        >
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
        </SlimSelect>
    );
}
