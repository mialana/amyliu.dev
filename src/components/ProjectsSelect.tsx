import "slim-select/styles";
import type { Option } from "slim-select";
import SlimSelect from "slim-select/react";

const getTocItemForCard = (card: HTMLUListElement): HTMLUListElement | null => {
    const id = card.id;
    // the `data-slug` attribute of TOC items matches the `id` attribute of project cards
    return document.querySelector<HTMLUListElement>(`.toc-item[data-slug="${id}"]`);
};

const afterChange = (filters: Option[]) => {
    let selectors: string[] = [];

    const allCards = document.querySelectorAll<HTMLUListElement>(".project-card");

    if (filters.length === 0) {
        selectors.push(".project-card"); // get all cards
    }

    for (const filter of filters) {
        const [identifier, val] = filter.value.split(":");
        selectors.push(`.project-card[data-${identifier}=${val}]`);
    }

    const matchingCards = document.querySelectorAll<HTMLUListElement>(selectors.join(", "));

    console.log(matchingCards);
    matchingCards.forEach((card) => {
        if (!card) return;

        // show card and toc item
        card.style.display = "block";

        const tocItem = getTocItemForCard(card);
        if (tocItem) {
            tocItem.style.display = "block";
        }
    });
};

const beforeChange = (newFilters: Option[], oldFilters: Option[]) => {
    if (newFilters.length > 0 && oldFilters.length === 0) {
        // before change, hide all cards and toc items when the user first picks a filter
        const cards = document.querySelectorAll<HTMLUListElement>(".project-card");

        cards.forEach((card) => {
            if (!card) return;

            card.style.display = "none";

            const tocItem = getTocItemForCard(card);
            if (tocItem) {
                tocItem.style.display = "none";
            }
        });
    }

    return true; // change can always occur
};

export default function createProjectsSlimSelect() {
    return (
        <SlimSelect
            multiple
            settings={{
                closeOnSelect: false,
                showSearch: false,
                placeholderText: "Filter Projects <span class='fa-solid fa-caret-down'></span>",
            }}
            events={{ beforeChange: beforeChange, afterChange: afterChange }}
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
