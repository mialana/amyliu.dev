import type { Element } from "hast";
import fs from "node:fs/promises";
import path from "node:path";

export const addClassToHast = (node: Element, newClassName: string): Element => {
    node.properties ??= {};
    node.properties.className = [...normalizeClassName(node.properties.className), newClassName];
    return node;
};

export function normalizeClassName(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map(String);
    }
    if (typeof value === "string") {
        return [value];
    }
    return [];
}

/**
 * If source is local (i.e. in 'public' folder), reads the file
 * Otherwise, fetches the remote URL
 *
 * @param filePathOfOrigin In most cases, the markdown file that the `src` string was referenced in.
 */
export async function readOrFetchSource(src: string, filePathOfOrigin?: string): Promise<string | null> {
    try {
        if (/^https?:\/\//i.test(src)) {
            const res = await fetch(src);
            if (!res.ok) return null;

            return await res.text();
        } else if (src.startsWith("/")) {
            const publicDir = path.resolve(process.cwd(), "public");
            const absPath = path.resolve(publicDir, src.slice(1)); // strip leading slash and resolve

            if (!absPath.startsWith(publicDir)) return null;

            return await fs.readFile(absPath, "utf8");
        } else if (filePathOfOrigin && src.startsWith(".")) {
            const dir = path.dirname(filePathOfOrigin);
            const absPath = path.resolve(dir, src);

            return await fs.readFile(absPath, "utf8");
        }

        return null;
    } catch (err) {
        console.warn(`[rehype-svg] Failed to load ${src}: ${err}`);
        return null;
    }
}
