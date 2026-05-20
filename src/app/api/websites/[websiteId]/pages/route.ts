import {InsertablePage, Page} from "@/app/models/Page";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {FieldsUtil} from "@/app/utils/fieldsUtil";
import {LexicalPositionUtil} from "@/app/utils/LexicalPositionUtil";

export async function POST(request: Request, { params }: { params: Promise<{ websiteId: string }> }) {

    try {
        const { websiteId } = await params;

        ApiUtil.checkParam(websiteId);

        // On récupère l'utilisateur connecté
        const user = await ApiUtil.getConnectedUser();


        const sql = SqlUtil.getSql()

        //on récupère le site internet
        const [website] = await sql`
        SELECT * FROM website WHERE id = ${websiteId} or website_domain = ${websiteId} LIMIT 1
    `;

        // On vérifie que le site appartient bien à l'utilisateur
        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner of this website", 403);
        }

        // Récupération des données dans le body
        const insertablePage: InsertablePage = await request.json();

        // Validation des données
        FieldsUtil.checkFieldsOrThrow<InsertablePage>(FieldsUtil.checkPage, insertablePage)

        const pages : Page[] = await sql`SELECT * FROM page WHERE website_id = ${website.id}` as unknown as Page[];
        const pos = LexicalPositionUtil.getNextPosition(pages);
        const [res] = await sql`INSERT INTO page (path, website_id, icon_svg, title, position)
              VALUES (${insertablePage.path}, ${website.id}, ${insertablePage.icon_svg}, ${insertablePage.title}, ${pos})
              RETURNING *`;


        return ApiUtil.getSuccessNextResponse<Page>(res as Page, true);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error)
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ websiteId: string }> }) {

    try {
        const { websiteId } = await params;

        ApiUtil.checkParam(websiteId);

        const sql = SqlUtil.getSql()
        const res = await sql`
        SELECT page.* FROM website, page WHERE (website.id = ${websiteId} or website_domain = ${websiteId}) and page.website_id = website.id ORDER BY page.position
    `;
        return ApiUtil.getSuccessNextResponse<Page[]>(res as Page[]);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error)
    }

}