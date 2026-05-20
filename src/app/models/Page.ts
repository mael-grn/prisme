import {Language} from "@/app/models/TextToTranslate";

export interface Page {
    id: number;
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    position: string;
    lang: Language;
}

export interface InsertablePage {
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    lang?: Language;
}
