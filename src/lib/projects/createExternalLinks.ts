import siteMappings from "@/lib/externalSiteMappings.json";

export interface ExternalLinkItem {
    url: string;
    label: string;
}

export function getLinkFavicon(url: string) {
    try {
        const { origin, hostname } = new URL(url);
        if (hostname === "asset-browser-zeta.vercel.app") return `${origin}/strawberry.svg`;
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
        return hostname
            .replace("www.", "")
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    } catch {
        return "External Link";
    }
}

export default function (code: string | undefined, externalLinks: string[]) {
    const links: ExternalLinkItem[] = [];

    if (code) {
        links.push({ url: code, label: getLabel(code) });
    }

    externalLinks.forEach((url) => {
        links.push({ url, label: getLabel(url) });
    });

    return links;
}
