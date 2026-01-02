import { useState, useEffect, useRef } from "react";
import SlimSelect from "slim-select";

interface FilterOptions {
    type: string;
    category: string;
}

export default function ProjectsFilter() {
    const slim = useRef<SlimSelect | null>(null);

    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Filter projects function
    const filterProjects = (filters: FilterOptions) => {
        const projectCards = document.querySelectorAll("[data-type][data-category]");

        projectCards.forEach((card) => {
            const type = card.getAttribute("data-type");
            const category = card.getAttribute("data-category");

            const slug = card.id; // Extract slug from the card's id
            const tocItem = document.querySelector(`li[data-slug="${slug}"]`); // Query corresponding TOC item

            let show = true;

            // by type
            if (filters.type !== "all" && !type?.startsWith(filters.type)) {
                show = false;
            }

            // by category
            if (category && filters.category !== "all" && category !== filters.category) {
                show = false;
            }

            // show/hide card
            if (show) {
                (card as HTMLElement).style.display = "block";
                if (tocItem) {
                    (tocItem as HTMLElement).style.display = "block";
                }
            } else {
                (card as HTMLElement).style.display = "none";

                if (tocItem) {
                    (tocItem as HTMLElement).style.display = "none";
                }
            }
        });
    };

    useEffect(() => {
        slim.current = new SlimSelect({
            select: "#slim-select-projects-filter",
            settings: { closeOnSelect: false, allowDeselect: true, showSearch: false },
            data: [
                {
                    label: "Type",
                    options: [
                        { text: "All Types", value: "type:all" },
                        { text: "Solo", value: "type:solo" },
                        { text: "Team", value: "type:team" },
                    ],
                },
                {
                    label: "Category",
                    options: [
                        { text: "All Categories", value: "category:all" },
                        { text: "Personal", value: "category:personal" },
                        { text: "Research", value: "category:research" },
                        { text: "School", value: "category:school" },
                    ],
                },
            ],
            events: {
                afterChange: (values) => {
                    let type = "all";
                    let category = "all";

                    for (const v of values) {
                        const [kind, val] = v.value.split(":");
                        if (kind === "type") type = val;
                        if (kind === "category") category = val;
                    }

                    setTypeFilter(type);
                    setCategoryFilter(category);
                },
            },
        });

        slim.current.setSelected(["type:all", "category:all"]);

        return () => {
            slim.current?.destroy();
            slim.current = null;
        };
    }, []);

    useEffect(() => {
        filterProjects({ type: typeFilter, category: categoryFilter });
    }, [typeFilter, categoryFilter]);

    return (
        <menu className="gap-3xl desktop:gap-sm desktop:flex-col bg-primary-shade desktop:bg-primary-neutral flex p-2">
            <h1 className="desktop:block hidden">Project Selection</h1>

            <select id="slim-select-projects-filter" multiple />
        </menu>
    );
}
