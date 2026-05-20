import axios, { AxiosError } from "axios";
import {Website, InsertableDisplayWebsite} from "../models/Website";
import {CSSProperties} from "react";
import CssUtil from "@/app/utils/CssUtil";
import {InsertableWebsiteColors, WebsiteColors} from "@/app/models/WebsiteColors";
import StringUtil from "@/app/utils/StringUtil";

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

    /**
     * Get the CSS properties for a given website, based on its colors.
     * @param websiteId
     */
    public static async getCSSPropertiesForWebsite(websiteId: string): Promise<CSSProperties> {
        const website = await WebsiteService.getWebsite(websiteId);
        try {
            const response = await axios.get(`/api/websites/${websiteId}/colors`);
            return CssUtil.websiteColorsToCSS(await this.getColors(websiteId));
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async insertColors(websiteId: string, colors: InsertableWebsiteColors): Promise<WebsiteColors> {
        try {
            const response = await axios.post(`/api/websites/${websiteId}/colors`, colors);
            return response.data.data;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async updateColors(websiteId: string, colors: InsertableWebsiteColors): Promise<WebsiteColors> {
        try {
            const response = await axios.put(`/api/websites/${websiteId}/colors`, colors);
            return response.data.data;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getColors(websiteId: string): Promise<WebsiteColors> {
        try {
            const response = await axios.get(`/api/websites/${websiteId}/colors`);
            return response.data.data as WebsiteColors;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async createWebsite(newWebsite: InsertableDisplayWebsite): Promise<Website> {
        try {
            const response = await axios.post('/api/me/websites', newWebsite);
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