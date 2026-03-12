import {Subcategory} from "@/app/models/Subcategory";

export interface RecursiveCategory {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

export interface Category {
    id: number;
    name: string;
}

export interface InsertableCategory {
    name: string;
}