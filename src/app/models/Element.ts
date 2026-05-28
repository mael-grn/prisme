import {Generic} from "@/app/models/Generic";

export interface Element extends Generic {
    id: number;
    page_id: number;
    element_type: string;
    position: string;
    content: string;
    lang: string;
    father_element_id?: number;
}

export interface InsertableElement extends Generic {
    page_id: number;
    element_type: string;
    content: string;
    lang?: string | undefined;
    father_element_id?: number;
}
