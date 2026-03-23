import {RecursiveSection} from "@/app/models/Section";
import {Language} from "@/app/models/TextToTranslate";

export interface RecursivePage {
    id: number;
    path: string;
    website_id: number;
    sections: RecursiveSection[];
    icon_svg?: string;
    title: string;
    description?: string;
    position: number;
    lang: Language;
}

export interface Page {
    id: number;
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    description?: string;
    position: number;
        lang: Language;
}

export interface InsertablePage {
    path: string;
    website_id: number;
    icon_svg?: string;
    title: string;
    description?: string;
    lang?: Language;
}
