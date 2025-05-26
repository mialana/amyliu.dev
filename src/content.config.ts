import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            publicationDate: z.date(),
            image: image().optional(),
            imageAlt: z.string().optional(),
            tags: z.array(z.string()).optional(),
        }),
});

const projects = defineCollection({
    loader: glob({
        pattern: "**/[^_]*.{md,mdx}",
        base: "./src/content/projects",
    }),
    schema: () =>
        z.object({
            title: z.string(),
            description: z.string(),
            publicationDate: z.date().optional(),
            href: z.string(),
        }),
});

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

const project = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/project" }),
    schema: projectSchema,
});

export const collections = { blog, projects, project };
