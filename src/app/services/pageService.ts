import {InsertablePage, Page} from "@/app/models/Page";
import axios, {AxiosError} from "axios";
import StringUtil from "@/app/utils/StringUtil";

export default class PageService {

    /**
     * Get all pages for the current logged in user
     */
    static async getMyPages(websiteId : number) : Promise<Page[]> {
        try {
            const response = await axios.get(`/api/websites/${websiteId}/pages`);
            return response.data.data as Page[];
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    /**
     * Get a page by its id
     * @param pageId
     */
    static async getPage(pageId: number) : Promise<Page>  {
        try {
            const response = await axios.get(`/api/pages/${pageId}`);
            return response.data.data as Page;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    /**
     * Insert a new page and return the newly created page
     * @param newPage
     */
    static async insertPage(newPage: InsertablePage) : Promise<Page> {
        try {
            const response = await axios.post(`/api/websites/${newPage.website_id}/pages`, newPage);
            return response.data.data as Page;
        } catch (e) {
            const perso = {code: 409, message: "The page name is already used. Please choose another name."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }

    /**
     * Update an existing page and return the updated page
     * @param updatedPage
     */
    static async updatePage(updatedPage: Page) : Promise<Page> {
        try {
            const response = await axios.put(`/api/pages/${updatedPage.id}`, updatedPage);
            return response.data.data as Page;
        } catch (e) {
            const perso = {code: 409, message: "The page name is already used. Please choose another name."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }

    /**
     * Delete a page and return the number of deleted rows
     * @param page
     */
    static async deletePage(page: Page) : Promise<void> {
        try {
            await axios.delete(`/api/pages/${page.id}`);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async movePage(targetId: number, referenceId: number, direction: 'up' | 'down') : Promise<Page> {
        try {
            const response = await axios.post(`/api/pages/${targetId}/move`, {referencedId: referenceId, direction: direction});
            return response.data.data as Page;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}


