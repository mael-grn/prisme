import {z} from "zod";

export const elementSchema = z.object({
    page_id: z.number({error: "L'identifiant de la page (ou section) est requis."})
        .int()
        .positive("L'identifiant doit être un entier positif."),

    element_type: z.string({error: "Le type d'élément est requis."})
        .min(1, "Le type d'élément ne peut pas être vide.")
        .max(100, "Le type d'élément est trop long."),

    content: z.string().optional()
})
    .superRefine((data, ctx) => {
        // Si c'est une image, on n'a pas besoin de valider le contenu textuel
        if (data.element_type === "image") return;

        // Pour tous les autres types, le contenu est obligatoire
        if (!data.content || data.content.trim().length === 0) {
            ctx.addIssue({
                code: "custom", // Correction Zod v4 : simple string au lieu de z.ZodIssueCode.custom
                message: "Le contenu est requis pour cet élément.",
                path: ["content"]
            });
            return;
        }

        // Règles spécifiques selon le type
        if (data.element_type === "lien") {
            try {
                const u = new URL(data.content);
                if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
            } catch {
                ctx.addIssue({
                    code: "custom",
                    message: "L'URL fournie pour ce lien est invalide.",
                    path: ["content"]
                });
            }
        }

        if (data.element_type === "titre" && data.content.length > 50) {
            ctx.addIssue({
                code: "custom",
                message: "Le titre ne doit pas dépasser 50 caractères.",
                path: ["content"]
            });
        }
    });

export type ValidatedElement = z.infer<typeof elementSchema>;
