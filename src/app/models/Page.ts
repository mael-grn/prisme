import {RecursiveSection} from "@/app/models/Section";

export interface RecursivePage {
    id: number;
    path: string;
    website_id: number;
    sections: RecursiveSection[];
    icon_svg?: string;
    title: string;
    description?: string;
    position: number;
}