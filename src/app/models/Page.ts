import {Language} from "@/app/models/TextToTranslate";
import {Generic} from "@/app/models/Generic";

export interface Page extends Generic {
    id: number;
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    position: string;
    lang: Language;
}

export interface InsertablePage extends Generic {
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    lang?: Language;
}
