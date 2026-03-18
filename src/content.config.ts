import { defineCollection, reference, type ImageFunction } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "zod";

const projectsCollection = defineCollection({
    loader: glob({ pattern: ["**/*.md*"], base: "./src/content/projects" }),
    schema: ({ image }: { image: ImageFunction }) =>
        z.object({
            title: z.string(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
            thumbnail: image(),
            thumbnail_540w: image(),
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
        }),
});

const TagSchema = z.object({
    title: z.string(),
    variant: z.enum(["tag", "techStack"]), // do not create a type as nothing should import this module
    referrers: z.array(z.object({ id: z.string(), collection: z.enum(["projects", "models3D"]) })),
});

const tagsCollection = defineCollection({ loader: file("./src/content/tags.json"), schema: () => TagSchema });

const Model3DSchema = z.object({
    title: z.string(),
    uid: z.string(),

    embedUrl: z.url(),
    viewerUrl: z.url(),
    apiUrl: z.url(),

    publishedAt: z.string().transform((str) => new Date(str)),

    description: z.string(),

    vertexCount: z.number().int(),
    faceCount: z.number().int(),

    thumbnails: z.array(z.object({ src: z.url(), width: z.number(), height: z.number(), lod: z.number() })).min(1),

    tags: z.array(z.string()),
});

const models3DCollection = defineCollection({
    loader: file("./src/content/models3D.json"),
    schema: () => Model3DSchema,
});

export const collections = { projects: projectsCollection, tags: tagsCollection, models3D: models3DCollection };
