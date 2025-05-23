import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projectSchema = z.object({
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

export type projectSchema = z.infer<typeof projectSchema>;

const projectCollection = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/project" }),
    schema: projectSchema,
});

export const collections = {
    project: projectCollection,
};
