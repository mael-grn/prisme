import {Generic} from "@/app/models/Generic";

export interface Tag extends Generic {
    id: number;
    name: string;
}

export interface InsertableTag extends Generic {
    name: string;
}