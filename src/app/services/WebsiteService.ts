import axios, { AxiosError } from "axios";
import {Website, InsertableWebsite} from "../models/Website";
import {CSSProperties} from "react";
import CssUtil from "@/app/utils/CssUtil";
import {WebsiteColors} from "@/app/models/WebsiteColors";
import StringUtil from "@/app/utils/StringUtil";
import ColorUtil from "@/app/utils/ColorUtil";

/**
 * Service pour gérer et traiter les données des sites web, y compris la mise en cache côté client.
 */
export default class WebsiteService {

    /**
     * Get the recursive website data, either from cache or by fetching it from the server.
     * @param domainOrId
     */
    static async getWebsite(domainOrId: string): Promise<Website> {
        try {
            const response = await axios.get(`/api/websites/${domainOrId}`);
            return response.data.data; // No cast necessary, the data is already in the correct format
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }


    public static async getCSSPropertiesForWebsite(websiteId: string): Promise<CSSProperties> {
        const website = await WebsiteService.getWebsite(websiteId);
        try {
            const response = await axios.get(`/api/websites/${websiteId}/colors`);
            return CssUtil.getCSSPropertiesFromImage((response.data.data as Website).image_src);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async createWebsite(newWebsite: InsertableWebsite): Promise<Website> {
        try {
            const response = await axios.post('/api/me/websites', newWebsite);
            return response.data.data as Website;
        } catch (e) {
            const perso = {code: 409, message: "This website title is already used. Please choose another title."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }

    static async editWebsite(edited: Website): Promise<Website> {
        try {
            const response = await axios.put('/api/websites/'+edited.id, edited);
            return response.data.data as Website;
        } catch (e) {
            const perso = {code: 409, message: "This website title is already used. Please choose another title."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }


    static async getMyWebsites(): Promise<Website[]> {
        try {
            const response = await axios.get('/api/me/websites');
            return response.data.data as Website[];
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async deleteWebsite(websiteId: number): Promise<void> {
        try {
            await axios.delete(`/api/websites/${websiteId}`);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

}