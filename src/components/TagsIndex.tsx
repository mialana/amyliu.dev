import { z } from "zod";
import type { CollectionEntry } from "astro:content"; // only import types so this component does not need to be hydrated

import { useLayoutEffect, useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

import { DARK_THEME_TEXT, ROOT_DATA_ATTRIBUTE, ThemeOptions, type Theme } from "@/lib/handleThemeButton";
import { snakeCaseToHumanReadable } from "@/lib/utils";

type TagEntry = CollectionEntry<"tags">;
type TagCloudEntry = { value: string; count: number };

export const ThemeSchema = z.enum(ThemeOptions);

const isThemeMutation = (mutation: MutationRecord) =>
    mutation.type === "attributes" &&
    mutation.target === document.documentElement &&
    mutation.attributeName === ROOT_DATA_ATTRIBUTE;

const updateFromDOM = (callback: (theme: Theme) => void, mutationList?: MutationRecord[]) => {
    if (mutationList && !mutationList.some(isThemeMutation)) return;

    const foundTheme = document.documentElement.getAttribute(ROOT_DATA_ATTRIBUTE);

    const result = ThemeSchema.safeParse(foundTheme);

    if (result.success) {
        callback(result.data);
    }
};

interface TagLinkProps {
    id: string;
    count?: number;
    title?: string;
    style?: React.CSSProperties;
    extraClassNames?: string;
}

function TagLink({ id, count, title, style, extraClassNames }: TagLinkProps) {
    return (
        <a
            href={`/tags/${id}/`}
            title={count !== undefined ? `${count} ${count > 1 ? "Mentions" : "Mention"}` : undefined}
            style={style}
            className={`inline-block py-2 font-semibold no-underline hover:underline hover:underline-offset-2 hover:brightness-150 ${extraClassNames}`}>
            {title ?? snakeCaseToHumanReadable(id)}
        </a>
    );
}

interface TagsIndexProps {
    tags: TagEntry[];
}

export default function TagsIndex({ tags }: TagsIndexProps) {
    const tagCloud: TagCloudEntry[] = tags.map((tag) => ({ value: tag.id, count: tag.data.referrers.length }));

    const [wordCloudView, setWordCloudView] = useState(true);
    const [luminosity, setLuminosity] = useState<"light" | "dark">("dark");
    const [cloudSizes, setCloudSizes] = useState({ min: 16, max: 32 });

    const setLuminosityFromTheme = (theme: Theme) => {
        setLuminosity(theme === DARK_THEME_TEXT ? "light" : "dark");
    };

    useEffect(() => {
        updateFromDOM(setLuminosityFromTheme); // initial call
    }, []);

    /* setup mutation observer for changes to theme from `ThemeClient` */
    useLayoutEffect(() => {
        const root = document.documentElement;

        const observer = new MutationObserver((mutationList) => updateFromDOM(setLuminosityFromTheme, mutationList));

        observer.observe(root, { attributes: true, attributeFilter: [ROOT_DATA_ATTRIBUTE] });
        return () => observer.disconnect();
    });

    return (
        <div>
            {/* Button */}
            <button
                onClick={() => setWordCloudView(!wordCloudView)}
                className="bg-inverted-tertiary/50 text-dark-important-text p-xdouble-y-2 mb-6 cursor-pointer rounded-md border text-sm hover:brightness-150"
                aria-label="Switch Tags Index View Button">
                Switch to {wordCloudView ? "Alphabetical List View" : "Wordcloud View"}
            </button>

            <div id="tags-index-container">
                {/* Tag Cloud */}
                {wordCloudView ? (
                    <TagCloud
                        minSize={cloudSizes.min}
                        maxSize={cloudSizes.max}
                        colorOptions={{ luminosity, alpha: 1.0 }}
                        tags={tagCloud}
                        renderer={(tag: TagCloudEntry, size: number, color: string) => {
                            return (
                                <TagLink
                                    key={tag.value}
                                    id={tag.value}
                                    count={tag.count}
                                    extraClassNames={`text-[${color}]`}
                                    style={{ color, fontSize: size, marginInline: "0.5rem" }}
                                />
                            );
                        }}
                    />
                ) : (
                    <div className="gap-x-lg grid grid-cols-3 leading-tight">
                        {/* List View */}
                        {tags.map((tag) => (
                            <p key={tag.id}>
                                <TagLink
                                    id={tag.id}
                                    count={tag.data.referrers.length}
                                    title={tag.data.title}
                                    extraClassNames={`${tag.data.variant === "tag" ? "text-violet-accent" : "text-orange-accent"}`}
                                />
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
