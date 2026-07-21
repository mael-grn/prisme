export default interface Translation {
    id: number;
    content: string;
    lang: string;
    element_id: number;
}

export interface InsertableTranslation {
    content: string;
    lang: string;
    element_id: number;
}