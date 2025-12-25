import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

interface TagLinkProps {
    tag: string;
    style?: React.CSSProperties;
    className?: string;
}

function TagLink({ tag, style, className }: TagLinkProps) {
    return (
        <a
            href={`/tags/${tag}/`}
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

    /* update based on light or dark mode */
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        function updateLuminosity() {
            if (
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                setLuminosity("light");
            } else {
                setLuminosity("dark");
            }
        }

        media.addEventListener("change", updateLuminosity);
        updateLuminosity(); // call once at beginning

        return () => media.removeEventListener("change", updateLuminosity);
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
                    {uniqueTags.map((tag) => (
                        <p key={tag}>
                            <TagLink
                                tag={tag}
                                className={"hover:text-red-accent!"}
                            />
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
