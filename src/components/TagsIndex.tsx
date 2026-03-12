import { z } from "zod";

import { useLayoutEffect, useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

import { DARK_THEME_TEXT, ROOT_DATA_ATTRIBUTE, ThemeOptions, type Theme } from "@/lib/handleThemeButton";

export const ThemeSchema = z.enum(ThemeOptions);

interface TagLinkProps {
    tag: string;
    count?: number;
    style?: React.CSSProperties;
    className?: string;
}

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

function TagLink({ tag, count, style, className }: TagLinkProps) {
    return (
        <a
            href={`/tags/${tag}/`}
            title={count !== undefined ? `${count} ${count > 1 ? "Mentions" : "Mention"}` : undefined}
            style={style}
            className={`not-prose inline-block py-2 font-semibold no-underline hover:underline hover:underline-offset-2 ${className}`}
        >
            {tag.replaceAll("_", " ")}
        </a>
    );
}

interface TagsIndexProps {
    tagCloudData: { value: string; count: number }[];
}

export default function TagsIndex({ tagCloudData }: TagsIndexProps) {
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
                className="bg-inverted-tertiary/50 text-inverted-important-text mb-6 cursor-pointer rounded-md border px-2 py-1 text-sm hover:brightness-150"
            >
                Switch to {wordCloudView ? "Alphabetical List View" : "Wordcloud View"}
            </button>

            <div id="tags-index-container">
                {/* Tag Cloud */}
                {wordCloudView ? (
                    <TagCloud
                        minSize={cloudSizes.min}
                        maxSize={cloudSizes.max}
                        colorOptions={{ luminosity, alpha: 1.0 }}
                        tags={tagCloudData}
                        renderer={(tag: { value: string; count: number }, size: number, color: string) => {
                            return (
                                <TagLink
                                    key={tag.value}
                                    tag={tag.value}
                                    count={tag.count}
                                    className={`text-[${color}]! hover:brightness-150!`}
                                    style={{ color, fontSize: size, marginInline: "0.5rem" }}
                                />
                            );
                        }}
                    />
                ) : (
                    <div className="columns-3 leading-tight">
                        {/* List View */}
                        {tagCloudData.map((tag) => (
                            <p key={tag.value}>
                                <TagLink tag={tag.value} count={tag.count} className={"hover:text-red-accent!"} />
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
