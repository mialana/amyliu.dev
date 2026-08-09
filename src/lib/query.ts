/* query the projects collection and return the data in structured format for use in `@/pages/projects/index.astro` */

import { type MarkdownHeading } from "astro";
import { type CollectionEntry } from "astro:content";

import { kebabCaseToHumanReadable, snakeCaseToHumanReadable, format } from "@/lib/utils";
import { type TocNode } from "@/lib/handleTocBehavior";
import { format as dateFormat } from "date-fns";

export const PROJECT_CARD_ID_PATTERN = `project-card__{0}`; // where `0` is the `project.id`
export const MODELS_3D_INDEX_ID_PATTERN = `models3D-index__{0}`;

const tagVariantArray = ["tag", "techStack"] as const;
type TagVariant = (typeof tagVariantArray)[number];

export type ProjectEntry = CollectionEntry<"projects">;
export type ModelEntry = CollectionEntry<"models3D">;
export type TagView = { id: string; data: CollectionEntry<"tags">["data"] };
export type ProjectEntryAugmented = ProjectEntry & { data: ProjectEntry["data"] & { tagsView: TagView[] } };

export type ContentView = {
    id: string;
    href: string;
    title: string;
    dateString: string;
    labelsString: string;
    description: string;
    thumbnail: ProjectEntry["data"]["thumbnail"];
    tagsView: TagView[];
};

export type SectionKey = "pinned" | `year-${number}`;

export type ProjectSection = { key: SectionKey; title: string; projectIndices: number[] };

/* Data to return from this module */
export type ProjectIndexData = { sections: ProjectSection[]; tocHeadings: MarkdownHeading[] };

export const projectSortOrderArray = ["startDate", "endDate"] as const;
export type ProjectSortOrder = (typeof projectSortOrderArray)[number];

export const DEFAULT_PROJECT_SORT_ORDER: ProjectSortOrder = "startDate";

type ProjectTocNodeExtra = {
    "data-project-type": ProjectEntry["data"]["type"];
    "data-project-category": ProjectEntry["data"]["category"];
};

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

const projectToSectionKey = (p: ProjectEntryAugmented, order: ProjectSortOrder): SectionKey => {
    if (p.data.pinned) return "pinned";
    return `year-${p.data[order].getFullYear()}`;
};

const createTagView = (id: string, variant: TagVariant, projectId: string): TagView => ({
    id,
    data: { title: snakeCaseToHumanReadable(id), variant, referrers: [{ id: projectId, collection: "projects" }] },
});

export function augmentProjectEntry(project: ProjectEntry): ProjectEntryAugmented {
    const tagsView: TagView[] = project.data.tags.map((t) => createTagView(t, "tag", project.id));
    const techStackView: TagView[] = project.data.techStack.map((t) => createTagView(t, "techStack", project.id));

    return { ...project, data: { ...project.data, tagsView: [...tagsView, ...techStackView] } };
}

export function createContentViewFromProject(project: ProjectEntry): ContentView {
    const tagsView: TagView[] = project.data.tags.map((t) => createTagView(t, "tag", project.id));
    const techStackView: TagView[] = project.data.techStack.map((t) => createTagView(t, "techStack", project.id));

    return {
        id: project.id,
        href: format("/projects/{0}/", project.id),
        title: project.data.title,
        dateString: format(
            "{0} - {1}",
            dateFormat(project.data.startDate, "MMMM yyyy"),
            dateFormat(project.data.endDate, "MMMM yyyy"),
        ),
        labelsString: format("{0} · {1}", project.data.category, project.data.type),
        description: project.data.description,
        thumbnail: project.data.thumbnail,
        tagsView: [...tagsView, ...techStackView],
    };
}

export function createContentViewFromModel(model: ModelEntry): ContentView {
    const tagsView: TagView[] = model.data.tags.map((t) => createTagView(t, "tag", model.id));

    return {
        id: model.id,
        href: format("/art/#{0}", format(MODELS_3D_INDEX_ID_PATTERN, model.id)),
        title: model.data.title,
        dateString: dateFormat(model.data.publishedAt, "MMMM dd, yyyy"),
        labelsString: "3D Model",
        description: model.data.description,
        thumbnail: model.data.thumbnails[0],
        tagsView: tagsView,
    };
}

function compareProjects(a: ProjectEntryAugmented, b: ProjectEntryAugmented, order: ProjectSortOrder): number {
    if (a.data.pinned && !b.data.pinned) return -1;
    else if (b.data.pinned && !a.data.pinned) return 1;
    else {
        const aYear = a.data[order].getTime();
        const bYear = b.data[order].getTime();
        return bYear - aYear; // recent dates come first
    }
}

function buildProjectSections(projects: readonly ProjectEntryAugmented[], order: ProjectSortOrder): ProjectSection[] {
    const sections: ProjectSection[] = [];

    const projectIndices = sortIndicesBy(projects, (a, b) => compareProjects(a, b, order));
    const projectSections = projectIndices.map((idx) => projectToSectionKey(projects[idx], order));
    const boundaries = findBoundaries(projectSections, (a, b) => a !== b);

    boundaries.forEach((start, idx) => {
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
    projects: readonly ProjectEntryAugmented[],
    sections: ProjectSection[],
): TocNode<ProjectTocNodeExtra> {
    const node: TocNode<ProjectTocNodeExtra> = {
        depth: 0,
        slug: "",
        text: "",
        children: sections.map((section) => ({
            depth: 1,
            slug: section.key,
            text: section.title,
            children: section.projectIndices.map((idx) => {
                const project = projects[idx];
                return {
                    depth: 2,
                    slug: format(PROJECT_CARD_ID_PATTERN, project.id),
                    text: project.data.title,
                    children: [],
                    extra: { "data-project-type": project.data.type, "data-project-category": project.data.category },
                };
            }),
        })),
    };
    return node;
}

export function getProjectIndexData(projects: readonly ProjectEntryAugmented[], order: ProjectSortOrder) {
    const sections = buildProjectSections(projects, order);
    const tocHeadings = buildTocNodeFromProjectSections(projects, sections);
    return { sections, tocHeadings };
}
