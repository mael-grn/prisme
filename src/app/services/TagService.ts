import {Tag, InsertableTag} from "../models/Tag";
import axios, {AxiosError} from "axios";
import StringUtil from "@/app/utils/StringUtil";

export default class TagService {

    static async getAllTags(): Promise<Tag[]> {
        try {
            const response = await axios.get(`/api/categories`);
            return response.data.data as Tag[];
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async createTag(newCat : InsertableTag): Promise<Tag> {
        try {
            const response = await axios.post(`/api/categories`, newCat);
            return response.data.data as Tag;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async updateTag(updatedCat : Tag): Promise<Tag> {
        try {
            const response = await axios.put(`/api/categories/${updatedCat.id}`, updatedCat);
            return response.data.data as Tag;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async deleteTag(category : Tag): Promise<void> {
        try {
            await axios.delete(`/api/categories/${category.id}`);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}