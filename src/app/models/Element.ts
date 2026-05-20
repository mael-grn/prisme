export interface Element {
    id: number;
    page_id: number;
    element_type: string;
    position: string;
    content: string;
    lang: string;
    father_element_id?: number;
}

export interface InsertableElement {
    page_id: number;
    element_type: string;
    content: string;
    lang?: string | undefined;
    father_element_id?: number;
}
