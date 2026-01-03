import { useRef } from "react";

import "slim-select/styles";
import SlimSelect from "slim-select";
import SlimSelectAdapter from "@/components/adapters/SlimSelectAdapter";
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

const getAddedOption = (newOptions: Option[], oldOptions: Option[]) => {
    const oldValues = new Set(oldOptions.map((o) => o.value));
    return newOptions.find((o) => !oldValues.has(o.value)) ?? null;
};

export default function ProjectsSelect() {
    const slimSelectRef = useRef<SlimSelect>(null);
    const processedOptionsRef = useRef<Option[] | null>(null);

    const afterChange = (options: Option[]) => {
        if (!processedOptionsRef.current) return;

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

    const beforeChange = (newOptions: Option[], oldOptions: Option[]) => {
        const added = getAddedOption(newOptions, oldOptions);
        if (!added) return true;

        const [addedIdentifier] = added.value.split(":");

        const processedOptions: Option[] = newOptions.filter((opt) => {
            const [identifier] = opt.value.split(":");
            return identifier !== addedIdentifier || opt.value === added.value;
        });

        console.log(newOptions, oldOptions, processedOptions);

        processedOptionsRef.current = processedOptions;

        const processedOptionValues: string[] = processedOptionsRef.current.map((opt) => opt.value);
        slimSelectRef?.current?.setSelected(processedOptionValues);

        return true;
    };

    return (
        <SlimSelectAdapter
            multiple
            onReady={(instance) => (slimSelectRef.current = instance)}
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
        </SlimSelectAdapter>
    );
}
