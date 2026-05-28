
import {Language} from "@/app/models/TextToTranslate";
import {Generic} from "@/app/models/Generic";

export interface Website extends Generic {
    id: number;
    owner_id: number;
    title: string;
    website_domain?: string;
    lang: Language;
    image_src?: string;
}

export interface InsertableWebsite extends Generic {
    owner_id: number;
    title: string;
    website_domain?: string;
    lang?: Language;
    image_src?: string;
}