import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

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
            className={`not-prose inline-block font-semibold no-underline hover:underline hover:underline-offset-2 ${className}`}
        >
            {tag.replaceAll("_", " ")}
        </a>
    );
}

interface TagsIndexProps {
    uniqueTags: string[];
    tagCloudData: { value: string; count: number }[];
}

export default function TagsIndex({
    uniqueTags,
    tagCloudData,
}: TagsIndexProps) {
    const [wordCloudView, setWordCloudView] = useState(true);
    const [luminosity, setLuminosity] = useState<"light" | "dark">("dark");
    const [cloudSizes, setCloudSizes] = useState({ min: 16, max: 32 });

    /* update based on `data-theme` attribute */
    useEffect(() => {
        const root = document.documentElement;

        const updateFromTheme = () => {
            const theme = root.getAttribute("data-theme");
            setLuminosity(theme === "dark" ? "light" : "dark");
        };

        // Initial sync
        updateFromTheme();

        const observer = new MutationObserver(updateFromTheme);

        observer.observe(root, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

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
        <div>
            {/* Button */}
            <button
                onClick={() => setWordCloudView(!wordCloudView)}
                className="bg-inverted-tertiary/50 text-inverted-important-text mb-6 cursor-pointer rounded-md border px-2 py-1 text-sm hover:brightness-150"
            >
                Switch to{" "}
                {wordCloudView ? "Alphabetical List View" : "Wordcloud View"}
            </button>

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
                <div className="columns-3 leading-tight *:in-first-of-type:mt-0">
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
    );
}
