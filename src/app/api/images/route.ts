import { ApiUtil } from "@/app/utils/apiUtil";
import {put} from "@vercel/blob";

export async function POST(request: Request) {
    try {
        // 1. Récupération des données sous forme de FormData
        const formData = await request.formData();

        // 2. Extraction du fichier (adapter la clé "image" selon votre front-end)
        const file = formData.get("image") as File | null;

        // Validation de la présence du fichier et de son type
        if (!file || !(file instanceof File)) {
            return ApiUtil.getErrorNextResponse("No file uploaded", 400);
        }

        if (!file.type.startsWith("image/")) {
            return ApiUtil.getErrorNextResponse("File must be an image", 422);
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        const blobRes = await put(file.name, file, {
            access: 'public',
            token: token,
            addRandomSuffix: true
        });

        return ApiUtil.getSuccessNextResponse({ url: blobRes.url }, true);

    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}