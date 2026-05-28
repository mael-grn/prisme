import { z } from "zod";

// 1. On crée le schéma de manière classique, mais on le nomme avec un "_" (privé)
const _websiteSchema = z.object({
    owner_id: z.number({ error: "L'identifiant du propriétaire est requis." })
        .int("L'identifiant doit être un nombre entier.")
        .positive("L'identifiant doit être positif."),

    title: z.string({ error: "Le nom du site est requis." })
        .min(1, "Le nom du site ne peut pas être vide.")
        .refine(val => !["secure", "api", "dashboard"].includes(val.toLowerCase()), {
            message: "Les noms 'secure', 'api' et 'dashboard' sont réservés et ne peuvent pas être utilisés."
        }),

    website_domain: z.union([
        z.string()
            .regex(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/, "Le format du domaine est invalide (ex: monsite.com).")
            .refine(val => !val.endsWith("/"), "Le domaine ne doit pas se terminer par '/'."),
        z.literal(""),
    ]).optional(),

    image_src: z.union([
        z.string().url("L'URL de l'image doit être une adresse web valide (http/https)."),
        z.literal(""),
    ]).optional(),
});

// 2. On génère ton type TypeScript proprement
export type ValidatedWebsite = z.infer<typeof _websiteSchema>;

// 3. LA MAGIE EST ICI : On exporte le schéma en le forçant à être un ZodType basique.
// Cela cache toute la machinerie interne ($ZodCheck, etc.) au résolveur.
export const websiteSchema: z.ZodType<ValidatedWebsite> = _websiteSchema;