{
    /* query the projects collection and return the data in parsed format for use in `@/projects/index.astro` */
}

import { getCollection, type CollectionEntry } from "astro:content";
import type { MarkdownHeading } from "astro";
import createSlug from "@/lib/projects/createSlug";

export type ProjectEntry = CollectionEntry<"projects">;

/* A desired section of projects */
export type ProjectSection = { id: string; title: string; projects: ProjectEntry[] };

/* Parsed data to return from this module */
export type ProjectIndexData = { sections: ProjectSection[]; tocHeadings: MarkdownHeading[] };

export async function getProjectIndexData(prefix: string): Promise<ProjectIndexData> {
    const allProjects = await getCollection("projects");

    const pinnedProjects = allProjects
        .filter((p) => p.data.pinned === true)
        .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

    const nonPinnedProjects = allProjects
        .filter((p) => p.data.pinned !== true)
        .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

    /* create a map of years to project entries within that year */
    const projectsByStartYear = new Map<number, ProjectEntry[]>();

    for (const project of nonPinnedProjects) {
        const year = project.data.startDate.getFullYear();
        if (!projectsByStartYear.has(year)) {
            projectsByStartYear.set(year, []);
        }
        projectsByStartYear.get(year)!.push(project);
    }

    const sections: ProjectSection[] = [];

    /* push the pinned projects first */
    if (pinnedProjects.length > 0) {
        sections.push({ id: "pinned", title: "Pinned", projects: pinnedProjects });
    }

    /* push the other sections one by one */
    [...projectsByStartYear.entries()]
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
