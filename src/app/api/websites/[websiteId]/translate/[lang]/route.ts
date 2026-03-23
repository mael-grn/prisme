import {Language} from "@/app/models/TextToTranslate";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {Element} from "@/app/models/Element";
import Translation from "@/app/models/Translation";
import {deeplTranslate} from "@/app/utils/DeeplUtil";
import {DisplayWebsite} from "@/app/models/DisplayWebsite";



export async function GET(request: Request, {params}: { params: Promise<{ websiteId: string, lang:string }> }) {
    try {

        const {websiteId, lang} = await params;
        ApiUtil.checkParam(websiteId);
        ApiUtil.checkParam(lang)

        const sql = SqlUtil.getSql()

        let [website] = await sql`SELECT * FROM display_websites WHERE id = ${websiteId} LIMIT 1` as DisplayWebsite[];
        if (!website) {
            return ApiUtil.getErrorNextResponse("Website does not exists", undefined, 404);
        }

        if (website.lang === lang) {
            return ApiUtil.getSuccessNextResponse<DisplayWebsite>(website as DisplayWebsite);
        }

        website.hero_title = await deeplTranslate(website.hero_title, lang as Language);

        return ApiUtil.getSuccessNextResponse<DisplayWebsite>(website as DisplayWebsite);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}