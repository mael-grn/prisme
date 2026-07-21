import {Language} from "@/app/models/TextToTranslate";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {deeplTranslate} from "@/app/utils/DeeplUtil";
import {Page} from "@/app/models/Page";



export async function GET(request: Request, {params}: { params: Promise<{ pageId: string, lang:string }> }) {
    try {

        const {pageId, lang} = await params;
        ApiUtil.checkParam(pageId);
        ApiUtil.checkParam(lang)

        const sql = SqlUtil.getSql()

        let [page] = await sql`SELECT * FROM page WHERE id = ${pageId} LIMIT 1` as Page[];
        if (!page) {
            return ApiUtil.getErrorNextResponse("Page does not exists", 404);
        }

        if (page.lang === lang) {
            return ApiUtil.getSuccessNextResponse<Page>(page as Page);
        }

        page.title = await deeplTranslate(page.title, lang as Language);

        return ApiUtil.getSuccessNextResponse<Page>(page as Page);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}