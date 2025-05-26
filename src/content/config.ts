import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projectsSchema = z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    techStack: z
        .array(z.string())
        .refine((items) => new Set(items).size === items.length, {
            message: "Tech used must be unique",
        })
        .optional(),
    tags: z
        .array(z.string())
        .refine((items) => new Set(items).size === items.length, {
            message: "Tags must be unique",
        })
        .optional(),
    slug: z.string().optional(),
});

export type projectsSchema = z.infer<typeof projectsSchema>;

const projectsCollection = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/projects" }),
    schema: projectsSchema,
});

export const collections = {
    projects: projectsCollection,
};
