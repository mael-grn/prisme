import {Language} from "@/app/models/TextToTranslate";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {Element} from "@/app/models/Element";
import Translation from "@/app/models/Translation";
import {deeplTranslate} from "@/app/utils/DeeplUtil";



export async function GET(request: Request, {params}: { params: Promise<{ elementId: string, lang:string }> }) {
    try {

        const {elementId, lang} = await params;
        ApiUtil.checkParam(elementId);
        ApiUtil.checkParam(lang)

        const sql = SqlUtil.getSql()

        const [element] = await sql`SELECT * FROM element WHERE id = ${elementId} LIMIT 1` as Element[];
        if (!element) {
            return ApiUtil.getErrorNextResponse("Element does not exists", 404);
        }

        if (element.element_type !== "text" && element.element_type !== "title") {
            return ApiUtil.getErrorNextResponse("Only text and title elements can be translated", 400);
        }

        if (element.lang === lang) {
            return ApiUtil.getSuccessNextResponse<Translation>({
                id: -1,
                element_id: element.id,
                lang: lang,
                content: element.content
            });
        }

        let [translation] = await sql`SELECT * FROM translation WHERE element_id = ${elementId} and lang = ${lang} LIMIT 1`;

        if (!translation) {
            console.log("translations not found in database, fetching element and translating it");

            let translatedText = await deeplTranslate(element.content, lang as Language);
            await sql`INSERT INTO translation (element_id, lang, content) VALUES (${elementId}, ${lang}, ${translatedText})`;

            [translation] = await sql`SELECT * FROM translation WHERE element_id = ${elementId} and lang = ${lang} LIMIT 1`;

            if (!translation) {
                return ApiUtil.getErrorNextResponse("Translation could not be saved", 500);
            }
        }
        return ApiUtil.getSuccessNextResponse<Translation>(translation as Translation);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}