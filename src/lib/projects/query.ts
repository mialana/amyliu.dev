{
    /* query the projects collection and return the data in parsed format for use in `@/projects/index.astro` */
}

import { getCollection, type CollectionEntry } from "astro:content";
import type { MarkdownHeading } from "astro";

export type ProjectEntry = CollectionEntry<"projects">;

/* A desired section of projects */
export type ProjectSection = { id: string; title: string; projects: ProjectEntry[] };

/* Parsed data to return from this module */
export type ProjectIndexData = { sections: ProjectSection[]; tocHeadings: MarkdownHeading[] };

export type ProjectSortKey = "startDate" | "endDate";

// Adapted from https://equk.co.uk/2023/02/02/generating-slug-from-title-in-astro/
export function createSlug(title: string, staticSlug: string | undefined = undefined) {
    return staticSlug
        ? staticSlug
        : title
            // remove leading & trailing whitespace
            .trim()
            // replace spaces
            .replace(/\s+/g, "_");
}

export async function getProjectIndexData(prefix: string, sortKey: ProjectSortKey = "startDate"): Promise<ProjectIndexData> {
    const allProjects = await getCollection("projects");

    const pinnedProjects = allProjects
        .filter((p) => p.data.pinned === true)
        .sort((a, b) => b.data[sortKey].valueOf() - a.data[sortKey].valueOf());

    const nonPinnedProjects = allProjects
        .filter((p) => p.data.pinned !== true)
        .sort((a, b) => b.data[sortKey].valueOf() - a.data[sortKey].valueOf());

    /* create a map of years to project entries within that year */
    const projectsBySortKey = new Map<number, ProjectEntry[]>();

    for (const project of nonPinnedProjects) {
        const year = project.data[sortKey].getFullYear();
        if (!projectsBySortKey.has(year)) {
            projectsBySortKey.set(year, []);
        }
        projectsBySortKey.get(year)!.push(project);
    }

    const sections: ProjectSection[] = [];

    /* push the pinned projects first */
    if (pinnedProjects.length > 0) {
        sections.push({ id: "pinned", title: "Pinned", projects: pinnedProjects });
    }

    /* push the other sections one by one */
    [...projectsBySortKey.entries()]
        .sort(([a], [b]) => b - a)
        .forEach(([year, projects]) => {
            sections.push({ id: `year-${year}`, title: String(year), projects });
        });

    /* create a 2-layer deep toc heading tree, where depth 1 is section ids and depth 2 is project titles */
    const tocHeadings: MarkdownHeading[] = sections.flatMap((section) => [
        { depth: 1, slug: section.id, text: section.title },
        ...section.projects.map((project) => ({
            depth: 2,
            slug: `${prefix}${createSlug(project.data.title, project.data.slug)}`,
            text: project.data.title,
        })),
    ]);

    return { sections, tocHeadings };
}
