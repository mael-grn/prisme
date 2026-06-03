import {InsertablePage, Page} from "@/app/models/Page";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";


export async function GET(request: Request, { params }: { params: Promise<{ websiteId: string, pageId: string }> }) {

    try {
        const { websiteId, pageId } = await params;

        ApiUtil.checkParam(websiteId);
        ApiUtil.checkParam(pageId);

        const sql = SqlUtil.getSql()
        let page = pageId
        if (!page.startsWith('/') && page != 'root') {
            page = '/' + pageId
        }
        const res = await sql`
        SELECT page.* FROM website, page WHERE (website.title = ${websiteId}) and page.website_id = website.id and (page.path = ${page.replaceAll(' ', '%20')}) LIMIT 1
    `;
        return ApiUtil.getSuccessNextResponse<Page>(res[0] as Page);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error)
    }

}