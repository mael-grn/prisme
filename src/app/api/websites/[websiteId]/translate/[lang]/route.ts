import {Language} from "@/app/models/TextToTranslate";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {deeplTranslate} from "@/app/utils/DeeplUtil";
import {Website} from "@/app/models/Website";



export async function GET(request: Request, {params}: { params: Promise<{ websiteId: string, lang:string }> }) {
    try {

        const {websiteId, lang} = await params;
        ApiUtil.checkParam(websiteId);
        ApiUtil.checkParam(lang)

        const sql = SqlUtil.getSql()

        let [website] = await sql`SELECT * FROM website" WHERE id = ${websiteId} LIMIT 1` as Website[];
        if (!website) {
            return ApiUtil.getErrorNextResponse("Website does not exists", 404);
        }

        if (website.lang === lang) {
            return ApiUtil.getSuccessNextResponse<Website>(website as Website);
        }

        website.title = await deeplTranslate(website.title, lang as Language);

        return ApiUtil.getSuccessNextResponse<Website>(website as Website);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}