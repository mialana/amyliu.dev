import React, { useState } from "react";
import siteMappings from "@/lib/siteMappings.json";

interface LinkItem {
    url: string;
    label: string;
}

interface Props {
    code?: string;
    externalLinks?: string[];
}

function getFavicon(url: string) {
    try {
        const { origin, hostname } = new URL(url);
        if (hostname == "asset-browser-zeta.vercel.app")
            return `${origin}/strawberry.svg`;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
        return "";
    }
}

function getLabel(url: string) {
    try {
        const { href, hostname } = new URL(url);
        const match = siteMappings.find((mapping) =>
            href.includes(mapping.host),
        );
        if (match) return match.label;
        else
            return hostname
                .replace("www.", "")
                .split(".")[0]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
    } catch {
        return "External Link";
    }
}

const fallbackGlobe =
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

const ProjectExternalLinks: React.FC<Props> = ({
    code,
    externalLinks = [],
}) => {
    const links: LinkItem[] = [];
    if (code) {
        links.push({ url: code, label: getLabel(code) });
    }
    externalLinks.forEach((url, i) => {
        links.push({ url, label: getLabel(url) });
    });

    return (
        <div className="flex flex-col items-center gap-4">
            {links.map(({ url, label }) => {
                const [imgSrc, setImgSrc] = useState(getFavicon(url));
                return (
                    <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-auto my-2 flex w-20 flex-col items-center gap-2"
                    >
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow transition hover:scale-105">
                            <img
                                src={imgSrc || getFavicon(url) || fallbackGlobe}
                                alt="Favicon"
                                width={32}
                                height={32}
                                loading="lazy"
                                onError={() => setImgSrc(fallbackGlobe)}
                                className="rounded-xl bg-white"
                                title={label}
                            />
                        </span>
                        <span className="mt-1 text-center text-xs leading-tight font-medium text-neutral-900">
                            {label}
                        </span>
                    </a>
                );
            })}
        </div>
    );
};

export default ProjectExternalLinks;
