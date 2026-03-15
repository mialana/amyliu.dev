{
    /* query the projects collection and return the data in parsed format for use in `@/projects/index.astro` */
}

import { type CollectionEntry } from "astro:content";
import type { MarkdownHeading } from "astro";

import { kebabCaseToHumanReadable } from "@/lib/utils";
import { type TocNode } from "@/lib/handleTocBehavior";

export type ProjectEntry = CollectionEntry<"projects">;

class TagLike {
    readonly identity: "tag" | "tech-stack";
    readonly value: string;
    constructor(identity: "tag" | "tech-stack", value: string) {
        this.identity = identity;
        this.value = value;
    }
    get label() {
        return this.identity === "tag" ? "Tag" : "Tech Stack";
    }
}

export type ProjectEntryStructured = ProjectEntry & { data: ProjectEntry["data"] & { tagsLike: TagLike[] } };

export type SectionKey = "pinned" | `year-${number}`;

export type ProjectSection = { key: SectionKey; title: string; projectIndices: number[] };

/* Data to return from this module */
export type ProjectIndexData = { sections: ProjectSection[]; tocHeadings: MarkdownHeading[] };

export const projectSortOrderArray = ["startDate", "endDate"] as const;
export type ProjectSortOrder = (typeof projectSortOrderArray)[number];

export const DEFAULT_PROJECT_SORT_ORDER: ProjectSortOrder = "startDate";

const sortIndicesBy = <T>(items: readonly T[], compare: (a: T, b: T) => number): number[] => {
    const indices = Array.from({ length: items.length }, (_, i) => i);
    indices.sort((aIdx, bIdx) => compare(items[aIdx], items[bIdx]));
    return indices;
};

const findBoundaries = <T>(items: readonly T[], isBoundary: (a: T, b: T) => boolean): number[] => {
    if (items.length === 0) return [];
    const boundaries = [0];
    for (let i = 1; i < items.length; i++) {
        if (isBoundary(items[i - 1], items[i])) {
            boundaries.push(i);
        }
    }
    return boundaries;
};

const projectToSectionKey = (p: ProjectEntryStructured, order: ProjectSortOrder): SectionKey => {
    if (p.data.pinned) return "pinned";
    return `year-${p.data[order].getFullYear()}`;
};

function combineTagsAndTechStack(project: ProjectEntry): ProjectEntryStructured {
    const tagsLike: TagLike[] = [];

    // sort in place and append
    project.data.tags.sort().forEach((t) => tagsLike.push(new TagLike("tag", t)));
    project.data.techStack.sort().forEach((t) => tagsLike.push(new TagLike("tech-stack", t)));

    return { ...project, data: { ...project.data, tagsLike: tagsLike } };
}

export function structureProject(project: ProjectEntry): ProjectEntryStructured {
    return combineTagsAndTechStack(project);
}

function compareProjects(a: ProjectEntryStructured, b: ProjectEntryStructured, order: ProjectSortOrder): number {
    if (a.data.pinned && !b.data.pinned) return -1;
    else if (b.data.pinned && !a.data.pinned) return 1;
    else {
        const aYear = a.data[order].getFullYear();
        const bYear = b.data[order].getFullYear();
        return bYear - aYear; // larger years come first
    }
}

function buildProjectSections(projects: readonly ProjectEntryStructured[], order: ProjectSortOrder): ProjectSection[] {
    const sections: ProjectSection[] = [];

    const projectIndices = sortIndicesBy(projects, (a, b) => compareProjects(a, b, order));
    const projectSections = projectIndices.map((idx) => projectToSectionKey(projects[idx], order));
    const boundaries = findBoundaries(projectSections, (a, b) => a !== b);

    boundaries.map((start, idx) => {
        const end =
            idx === boundaries.length - 1
                ? projectIndices.length // set to length if at the last boundary
                : boundaries[idx + 1];
        const sectionKey = projectSections[start];
        const sectionProjectIndices = projectIndices.slice(start, end);
        const section: ProjectSection = {
            key: sectionKey,
            title: kebabCaseToHumanReadable(sectionKey),
            projectIndices: sectionProjectIndices,
        };
        sections.push(section);
    });

    return sections;
}

function buildTocNodeFromProjectSections(
    projects: readonly ProjectEntryStructured[],
    sections: ProjectSection[],
    tocHeadingsPrefix: string,
): TocNode {
    const node: TocNode = {
        depth: 0,
        slug: "",
        text: "",
        children: sections.map((section) => ({
            depth: 1,
            slug: section.key,
            text: section.title,
            children: section.projectIndices.map((idx) => {
                const project = projects[idx];
                return { depth: 2, slug: `${tocHeadingsPrefix}${project.id}`, text: project.data.title, children: [] };
            }),
        })),
    };
    return node;
}

export function getProjectIndexData(
    projects: readonly ProjectEntryStructured[],
    order: ProjectSortOrder,
    tocHeadingsPrefix: string,
) {
    const sections = buildProjectSections(projects, order);
    const tocHeadings = buildTocNodeFromProjectSections(projects, sections, tocHeadingsPrefix);
    return { sections, tocHeadings };
}
