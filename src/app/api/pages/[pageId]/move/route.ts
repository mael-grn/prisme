import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {Page} from "@/app/models/Page";
import {LexicalPositionUtil} from "@/app/utils/LexicalPositionUtil";

export async function POST(request: Request, {params}: { params: Promise<{ pageId: string }> }) {
    try {
        const {pageId} = await params;
        const {referencedId, direction} = await request.json(); // ex: { targetId: "5", direction: "up" }
        const sql = SqlUtil.getSql();

        // 1. Récupérer tout pour avoir le contexte de tri
        const pages: Page[] = await sql`
            SELECT id, position FROM page WHERE website_id = (SELECT website_id FROM page WHERE id = ${pageId})
            ORDER BY position ASC
        ` as unknown as Page[];

        // 2. Calculer la nouvelle position
        const newPos = LexicalPositionUtil.getPositionRelative(pages, Number(pageId), referencedId, direction);

        // 3. Mise à jour simple (Une seule ligne !)
        const [res] = await sql`
            UPDATE page 
            SET position = ${newPos}
            WHERE id = ${pageId}
            returning *
        `;

        return ApiUtil.getSuccessNextResponse<Page>(res as Page);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }
}