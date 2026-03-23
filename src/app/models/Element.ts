export interface Element {
    id: number;
    section_id: number;
    element_type: string;
    position: number;
    content: string;
    lang: string;
}

export interface InsertableElement {
    section_id: number;
    element_type: string;
    content: string;
    lang?: string | undefined;
}
