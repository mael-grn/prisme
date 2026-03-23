import {RecursivePage} from "@/app/models/Page";
import {WebsiteColors} from "@/app/models/WebsiteColors";
import {Language} from "@/app/models/TextToTranslate";

export interface RecursiveWebsite {
    id: number;
    owner_id: number;
    title: string;
    website_domain?: string;
    auth_token: string;
    hero_image_url: string;
    hero_title: string;
    pages: RecursivePage[];
    colors: WebsiteColors;
    lang: string;
}

export interface DisplayWebsite {
    id: number;
    owner_id: number;
    title: string;
    website_domain?: string;
    auth_token: string;
    hero_image_url: string;
    hero_title: string;
    lang: Language;
}

export interface InsertableDisplayWebsite {
    owner_id: number;
    title: string;
    website_domain?: string;
    hero_image_url?: string;
    hero_title: string;
    lang?: Language;
}