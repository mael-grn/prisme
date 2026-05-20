
import {Language} from "@/app/models/TextToTranslate";

export interface Website {
    id: number;
    owner_id: number;
    title: string;
    website_domain?: string;
    lang: Language;
}

export interface InsertableDisplayWebsite {
    owner_id: number;
    title: string;
    website_domain?: string;
    lang?: Language;
}