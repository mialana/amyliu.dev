import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projectsSchema = z.object({
    title: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    type: z.string(),
    category: z.string(),
    description: z.string(),
    demoVideoLink: z.string().optional(),
    code: z.string().optional(),
    externalLinks: z.array(z.string()).optional(),
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
