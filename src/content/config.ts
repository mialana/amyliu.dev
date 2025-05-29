import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projectsSchema = z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    type: z.string(),
    category: z.string(),
    demoVideoLink: z.string().url(),
    techStack: z
        .array(z.string())
        .refine((items) => new Set(items).size === items.length, {
            message: "Tech used must be unique",
        }),
    tags: z
        .array(z.string())
        .refine((items) => new Set(items).size === items.length, {
            message: "Tags must be unique",
        }),
    slug: z.string().optional(),
});

export type projectsSchema = z.infer<typeof projectsSchema>;

const projectsCollection = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/projects" }),
    schema: projectsSchema,
});

export const collections = { projects: projectsCollection };
