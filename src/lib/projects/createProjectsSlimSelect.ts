import SlimSelect, { Option } from "slim-select";

const getTocItemForCard = (card: HTMLUListElement): HTMLUListElement | null => {
    const id = card.id;
    // the `data-slug` attribute of TOC items matches the `id` attribute of project cards
    return document.querySelector<HTMLUListElement>(`.toc-item[data-slug="${id}"]`);
};

const afterChange = (filters: Option[]) => {
    let selectors = [];
    if (filters.length === 0) selectors.push(".project-card"); // get all cards
    for (const filter of filters) {
        const [identifier, val] = filter.value.split(":");
        selectors.push(`.project-card[data-${identifier}=${val}]`); // get cards with corresponding data value
    }

    const matchingCards = document.querySelectorAll<HTMLUListElement>(selectors.join(", "));

    matchingCards.forEach((card) => {
        if (!card) return;
        // show card and toc item
        card.style.display = "block";

        const tocItem: HTMLUListElement | null = getTocItemForCard(card); // query corresponding TOC item
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

            const tocItem: HTMLUListElement | null = getTocItemForCard(card); // query corresponding TOC item
            if (tocItem) {
                tocItem.style.display = "none";
            }
        });
    }
    return true; // change can always occur
};

export default function () {
    new SlimSelect({
        select: "#slim-select-projects-filter",
        settings: {
            closeOnSelect: false,
            showSearch: false,
            placeholderText: "Filter Projects <span class='fa-solid fa-caret-down'></span>",
        },
        // data: [
        //     {
        //         label: "Type",
        //         options: [
        //             { text: "Solo", value: "type:solo" },
        //             { text: "Team", value: "type:team" },
        //         ],
        //     },
        //     {
        //         label: "Category",
        //         options: [
        //             { text: "Personal", value: "category:personal" },
        //             { text: "Research", value: "category:research" },
        //             { text: "Internship", value: "category:internship" },
        //             { text: "School", value: "category:school" },
        //         ],
        //     },
        // ],
        events: { beforeChange: beforeChange, afterChange: afterChange },
    });
}
