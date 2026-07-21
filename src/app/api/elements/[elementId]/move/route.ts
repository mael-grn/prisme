import {ApiUtil} from "@/app/utils/apiUtil";
import {Element} from "@/app/models/Element";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {LexicalPositionUtil} from "@/app/utils/LexicalPositionUtil";

export async function POST(request: Request, {params}: { params: Promise<{ elementId: string }> }) {
    try {
        const {elementId} = await params;
        ApiUtil.checkParam(elementId);

        const user = await ApiUtil.getConnectedUser();
        // On attend l'ID de l'élément cible et la direction du mouvement
        const { targetId, direction } = await request.json();

        const sql = SqlUtil.getSql();

        // 1. Récupérer l'élément à déplacer et vérifier les droits
        const [elementToMove] = await sql`
            SELECT e.id, e.position, e.page_id
            FROM element e
                     JOIN page p ON p.id = e.page_id
                     JOIN website dw ON p.website_id = dw.id
            WHERE e.id = ${Number(elementId)} AND dw.owner_id = ${user.id}
        `;

        if (!elementToMove) return ApiUtil.getErrorNextResponse("Not found", 404);

        // 2. Récupérer tous les éléments de la même section pour le contexte de tri
        const elementsInSection = await sql`
            SELECT id, position FROM element 
            WHERE page_id = ${(elementToMove as Element).page_id}
            ORDER BY position ASC
        ` as unknown as Element[];

        // 3. Calculer la nouvelle position relative
        const newPos = LexicalPositionUtil.getPositionRelative(
            elementsInSection,
            Number(elementId),
            targetId,
            direction
        );

        // 4. Mise à jour directe d'une seule ligne (très performant)
        const [val] = await sql`
            UPDATE element 
            SET position = ${newPos}
            WHERE id = ${Number(elementId)}
            returning *
        `;

        return ApiUtil.getSuccessNextResponse<Element>(val as Element);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }
}