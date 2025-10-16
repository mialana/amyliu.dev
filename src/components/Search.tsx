import { useState, useEffect, useLayoutEffect } from "react";

interface FilterOptions {
    type: string;
    category: string;
    excludeSchool: boolean;
}

interface FilterSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

const FilterSelect = ({
    id,
    label,
    value,
    onChange,
    options,
}: FilterSelectProps) => {
    const selectStyle = {
        appearance: "none" as const,
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: "no-repeat" as const,
        backgroundPosition: "right 4px center" as const,
        backgroundSize: "16px",
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-normal">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.stopPropagation(); // Stop propagation only for the select element
                    }
                }}
                onChange={(e) => onChange(e.target.value)}
                className="bg-light-offset dark:bg-dark-offset w-max min-w-[120px] cursor-pointer rounded-md border border-neutral-300 px-2 py-1 text-sm font-light focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none"
                style={selectStyle}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default function Search() {
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [excludeSchool, setExcludeSchool] = useState<boolean>(false);

    // Filter projects function
    const filterProjects = (filters: FilterOptions) => {
        const projectCards = document.querySelectorAll(
            "[data-type][data-category]",
        );

        projectCards.forEach((card) => {
            const type = card.getAttribute("data-type");
            const category = card.getAttribute("data-category");

            // Query the corresponding TOC item
            const slug = card.id; // Extract slug from the card's id
            const tocItem = document.querySelector(`li[data-slug="${slug}"]`);

            let show = true;

            // Filter by type
            if (filters.type !== "all" && type !== filters.type) {
                show = false;
            }

            // Filter by category
            if (filters.category !== "all" && category !== filters.category) {
                show = false;
            }

            // Filter out school projects if excludeSchool is true
            if (filters.excludeSchool && category === "school") {
                show = false;
            }

            // Show/hide the card
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

    // Initialize filtering when component mounts
    useLayoutEffect(() => {
        filterProjects({ type: "all", category: "all", excludeSchool: false });
    }, []);

    // Filter projects whenever filters change
    useLayoutEffect(() => {
        filterProjects({
            type: typeFilter,
            category: categoryFilter,
            excludeSchool: excludeSchool,
        });
    }, [typeFilter, categoryFilter, excludeSchool]);

    // Get available categories based on excludeSchool setting
    const getAvailableCategories = () => {
        const categories = ["personal", "research", "internship", "school"];
        return excludeSchool
            ? categories.filter((cat) => cat !== "school")
            : categories;
    };

    const typeOptions = [
        { value: "all", label: "All Types" },
        { value: "individual", label: "Individual" },
        { value: "group", label: "Group" },
    ];

    const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...getAvailableCategories().map((category) => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1),
        })),
    ];

    const showRestoreAll = typeFilter !== "all" || categoryFilter !== "all";

    return (
        <section className="w-fit min-w-max space-y-4 px-1">
            <h1 className="cursor-default leading-none font-normal">
                Filter Projects
            </h1>

            {/* Exclude School Projects Checkbox */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="excludeSchool"
                    checked={excludeSchool}
                    onChange={(e) => {
                        e.stopPropagation(); // Prevent click from propagating
                        setExcludeSchool(e.target.checked);
                    }}
                    className="flex-shrink-0 cursor-pointer focus:ring-neutral-500"
                />
                <label
                    htmlFor="excludeSchool"
                    className="text-sm leading-relaxed font-light whitespace-nowrap"
                >
                    Filter out all School projects
                </label>
            </div>

            {/* Restore All Button */}
            {showRestoreAll && (
                <div className="w-full px-4">
                    <button
                        className="bg-wanderer-300/75 w-full cursor-pointer rounded-sm text-sm leading-normal font-medium text-white outline-1"
                        onClick={() => {
                            setTypeFilter("all");
                            setCategoryFilter("all");
                        }}
                    >
                        Restore All
                    </button>
                </div>
            )}

            {/* Category Filter */}
            <FilterSelect
                id="categoryFilter"
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
            />

            {/* Type Filter */}
            <FilterSelect
                id="typeFilter"
                label="Type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
            />

            <a
                href="/tags/"
                className="hover:text-red-accent cursor-pointer text-[10px] font-extralight underline"
                onClick={(e) => e.stopPropagation()} // Prevent click from propagating
            >
                View Tags Index
            </a>
        </section>
    );
}
