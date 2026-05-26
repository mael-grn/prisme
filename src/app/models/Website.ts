
import {Language} from "@/app/models/TextToTranslate";

export interface Website {
    id: number;
    owner_id: number;
    title: string;
    website_domain?: string;
    lang: Language;
    image_src?: string;
}

export interface InsertableDisplayWebsite {
    owner_id: number;
    title: string;
    website_domain?: string;
    lang?: Language;
    image_src?: string;
}