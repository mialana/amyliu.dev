import { z, defineCollection, type ImageFunction } from "astro:content";
import { glob } from "astro/loaders";

const projectsCollection = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/projects" }),
    schema: ({ image }: { image: ImageFunction }) =>
        z.object({
            title: z.string(),
            startDate: z.date(),
            endDate: z.date(),
            thumbnail: image(),
            type: z.string(),
            category: z.string(),
            description: z.string(),
            pinned: z.boolean().optional(),
            demoVideoLink: z.string().optional(),
            code: z.string().optional(),
            externalLinks: z.array(z.string()).optional(),
            techStack: z
                .array(z.string())
                .refine((items) => new Set(items).size === items.length, { message: "Tech used must be unique" }),
            tags: z
                .array(z.string())
                .refine((items) => new Set(items).size === items.length, { message: "Tags must be unique" }),
            slug: z.string(),
        }),
});

export const collections = { projects: projectsCollection };
