import z from "zod";

export const pageSchema = z.object({
    website_id: z.number({ error: "L'identifiant du site est requis." })
        .int()
        .positive("L'identifiant du site doit être un entier positif."),

    title: z.string({ error: "Le titre de la page est requis." })
        .min(1, "Le titre de la page ne peut pas être vide.")
        .max(300, "Le titre ne doit pas dépasser 300 caractères."),

    path: z.string({ error: "Le chemin (path) est requis." })
        .min(1, "Le chemin de la page ne peut pas être vide.")
        .max(500, "Le chemin est trop long (maximum 500 caractères).")
        .startsWith("/", "Le chemin doit obligatoirement commencer par '/'.")
        .refine(val => !/\s/.test(val), "Le chemin ne doit contenir aucun espace."),

    icon_svg: z.union([
        z.string()
            .max(2000, "Le code SVG est trop long (maximum 2000 caractères).")
            .regex(/^\s*(<\?xml[\s\S]*?\?>\s*)?(<svg\b[^>]*>[\s\S]*?<\/svg>|<svg\b[^>]*\/>)\s*$/i, "Le format du code SVG est invalide."),
        z.literal(""),
    ]).optional(),
});

export type ValidatedPage = z.infer<typeof pageSchema>;
