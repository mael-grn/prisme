import {ApiUtil} from "@/app/utils/apiUtil";
import {WebsiteColors} from "@/app/models/WebsiteColors";
import ColorUtil from "@/app/utils/ColorUtil";

export async function POST(request: Request) {
    try {

        const data: {imageSrc:string} = await request.json();
        const colors : WebsiteColors = await ColorUtil.getColorsFromImage(data.imageSrc)
        return ApiUtil.getSuccessNextResponse<WebsiteColors>(colors);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}