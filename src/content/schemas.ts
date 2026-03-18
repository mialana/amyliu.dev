import { z } from "zod";

export const Model3DSchema = z.object({
    id: z.string(),
    data: z.object({
        title: z.string(),

        embedUrl: z.url(),
        viewerUrl: z.url(),
        apiUrl: z.url(),

        publishedAt: z.coerce.date(),

        description: z.string(),

        thumbnails: z.array(z.object({ src: z.url(), width: z.number(), height: z.number(), lod: z.number() })),

        vertexCount: z.number().int(),
        faceCount: z.number().int(),

        tags: z.array(
            z.object({
                id: z.string(),
                data: z.object({
                    title: z.string(),
                    variant: z.literal("tag"),
                    referrers: z.array(z.object({ id: z.string(), collection: z.literal("models3D") })),
                }),
            }),
        ),
    }),
});
