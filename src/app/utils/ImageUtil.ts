import {put} from "@vercel/blob";
import axios, {AxiosError} from "axios";
import StringUtil from "@/app/utils/StringUtil";

/**
 * Utility class for image management in vercel's blob storage
 */
export class ImageUtil {

    /**
     * Yes, it upload an image
     * @param file
     */
    static async uploadImage(file: File): Promise<string> {
        if (!file) {
            throw "No file provided";
        }
        const formData = new FormData();

        formData.append("image", file);

        try {
            const response = await axios.post("/api/images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data.url;
        } catch (e) {
            console.error(e);
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static getRandomBackgroundImage() : string {
        const images = [
            "forest",
            "hills",
            "mountain",
            "path",
            "wave"
        ]
        return "/img/" + images[Math.floor(Math.random() * images.length)] + ".jpg";
    }
}