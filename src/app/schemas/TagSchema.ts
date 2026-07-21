import {z} from "zod";

export const TagSchema = z.object({
    name: z.string({ error: "Le nom du tag est requis." })
        .min(1, "Le nom du tag ne peut pas être vide.")
        .max(200, "Le nom est trop long (maximum 200 caractères).")
});

export type ValidatedTag = z.infer<typeof TagSchema>;