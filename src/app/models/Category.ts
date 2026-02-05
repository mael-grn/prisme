import {Subcategory} from "@/app/models/Subcategory";

export interface RecursiveCategory {
    id: number;
    name: string;
    subcategories: Subcategory[];
}