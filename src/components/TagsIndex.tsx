import { useEffect, useLayoutEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

import DefaultButton from "@/components/defaults/DefaultButton.tsx"

import {
    DARK_THEME_TEXT,
    ROOT_DATA_ATTRIBUTE,
    type Theme,
    updateFromDOM,
} from "@/components/ThemeButton";

interface TagLinkProps {
    tag: string;
    count?: number;
    style?: React.CSSProperties;
    className?: string;
}

function TagLink({ tag, count, style, className }: TagLinkProps) {
    return (
        <a
            href={`/tags/${tag}/`}
            title={
                count !== undefined
                    ? `${count} ${count > 1 ? "Mentions" : "Mention"}`
                    : undefined
            }
            style={style}
            className={`not-prose inline-block font-semibold no-underline hover:underline hover:underline-offset-2 py-2 ${className}`}
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

        const observer = new MutationObserver((mutationList) =>
            updateFromDOM(setLuminosityFromTheme, mutationList),
        );

        observer.observe(root, {
            attributes: true,
            attributeFilter: [ROOT_DATA_ATTRIBUTE],
        });
        return () => observer.disconnect();
    });

    /* update based on window size */
    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)"); // tailwind md breakpoint

        const updateSizes = () => {
            if (media.matches) {
                setCloudSizes({ min: 12, max: 28 });
            } else {
                setCloudSizes({ min: 16, max: 48 });
            }
        };

        updateSizes(); // initial
        media.addEventListener("change", updateSizes);

        return () => media.removeEventListener("change", updateSizes);
    }, []);

    return (
        <div className="contents">
            <DefaultButton
                identifier="tags-index"
                callback={() => setWordCloudView(!wordCloudView)}
            >
                Switch to{" "}
                {wordCloudView ? "Alphabetical List View" : "Wordcloud View"}
            </DefaultButton>
            {/* Button */}

            <div id="tags-index-container">
                {/* Tag Cloud */}
                {wordCloudView ? (
                    <TagCloud
                        minSize={cloudSizes.min}
                        maxSize={cloudSizes.max}
                        colorOptions={{ luminosity, alpha: 1.0 }}
                        tags={tagCloudData}
                        renderer={(
                            tag: { value: string; count: number },
                            size: number,
                            color: string,
                        ) => {
                            return (
                                <TagLink
                                    key={tag.value}
                                    tag={tag.value}
                                    count={tag.count}
                                    className={`text-[${color}]! hover:brightness-150!`}
                                    style={{
                                        color,
                                        fontSize: size,
                                        marginInline: "0.5rem",
                                    }}
                                />
                            );
                        }}
                    />
                ) : (
                    <div className="columns-3 leading-tight">
                        {/* List View */}
                        {tagCloudData.map((tag) => (
                            <p key={tag.value}>
                                <TagLink
                                    tag={tag.value}
                                    count={tag.count}
                                    className={"hover:text-red-accent!"}
                                />
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
