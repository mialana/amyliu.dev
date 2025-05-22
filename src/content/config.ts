import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';

const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'Tags must be unique',
    }).optional(),
});


export type projectSchema = z.infer<typeof projectSchema>;

const projectCollection = defineCollection(
    { 
        loader: glob({ pattern: "**/*.md", base: "./src/content/project"}),
        schema: projectSchema 
    }
);

export const collections = {
    'project': projectCollection,
}