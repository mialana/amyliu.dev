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
        if (hostname == "asset-browser-zeta.vercel.app") return `${origin}/strawberry.svg`;
        else if (hostname.includes("webgpu.amyliu.dev")) return `${origin}/favicon/favicon.svg`;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
        return "";
    }
}

function getLabel(url: string) {
    try {
        const { href, hostname } = new URL(url);
        const match = siteMappings.find((mapping) => href.includes(mapping.host));
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

const ProjectExternalLinks: React.FC<Props> = ({ code, externalLinks = [] }) => {
    const links: LinkItem[] = [];
    if (code) {
        links.push({ url: code, label: getLabel(code) });
    }
    externalLinks.forEach((url, i) => {
        links.push({ url, label: getLabel(url) });
    });

    return (
        <div className="desktop:flex-col flex items-center justify-evenly gap-4">
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
                        <span className="bg-inverted-secondary/50 border-inverted-neutral desktop:rounded-2xl flex h-16 w-16 items-center justify-center rounded-md border p-1 shadow hover:scale-105">
                            <img
                                src={imgSrc || getFavicon(url)}
                                alt={`Favicon ${label}`}
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = "/resources/gif/loading.gif";
                                }}
                                className="size-3/4 rounded-xl"
                                title={label}
                                ref={(img) => {
                                    img?.classList.add("!bg-none", "!bg-white", "p-2");
                                }}
                            />
                        </span>
                        <span className="text-2xs desktop:text-xs mt-1 text-center leading-tight">{label}</span>
                    </a>
                );
            })}
        </div>
    );
};

export default ProjectExternalLinks;
