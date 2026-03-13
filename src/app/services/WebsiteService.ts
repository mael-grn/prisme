import axios, { AxiosError } from "axios";
import {DisplayWebsite, InsertableDisplayWebsite, RecursiveWebsite} from "@/app/models/DisplayWebsite";
import {CSSProperties} from "react";
import CssUtil from "@/app/utils/CssUtil";
import {getDefaultColors, InsertableWebsiteColors, WebsiteColors} from "@/app/models/WebsiteColors";
import CacheUtil from "@/app/utils/CacheUtil";
import StringUtil from "@/app/utils/StringUtil";

/**
 * Service pour gérer et traiter les données des sites web, y compris la mise en cache côté client.
 */
export default class WebsiteService {

    /**
     * Send the query and recover the website's data from the server.
     * It fetches un recursive website, which includes all nested pages and resources. Therefore, it is NOT fast.
     * @param idOrDomain either the website's ID or its domain name.
     * @private
     */
    private static async fetchWebsite(idOrDomain : string): Promise<RecursiveWebsite> {
        try {
            const response = await axios.get(`/api/websites/${idOrDomain}`);
            return response.data; // No cast necessary, the data is already in the correct format
        } catch (error) {
            throw new Error(`Failed to fetch data for domain : ${error}`);
        }
    }

    /**
     * Save the website data in the session storage for caching.
     * @param website
     * @private
     */
    private static saveWebsiteInCache(website: RecursiveWebsite) {
        if (!CacheUtil.hasSessionStorage()) return;
        try {
            sessionStorage.setItem("cached_website_" + website.title.toLowerCase(), JSON.stringify(website));
            sessionStorage.setItem("cached_website_" + website.id, JSON.stringify(website));
            sessionStorage.setItem("last_update", Date.now().toString());
        } catch {
            // ignore storage errors (quota, etc.)
        }
    }

    /**
     * Try to recover the website data from the session storage cache. Returns null if not found.
     * @param domainOrId
     * @private
     */
    private static recoverWebsiteFromCache(domainOrId: string): RecursiveWebsite | null {
        if (!CacheUtil.hasSessionStorage()) return null;
        try {
            const cachedWebsite = sessionStorage.getItem("cached_website_" + domainOrId.toLowerCase());
            if (!cachedWebsite) return null;
            return JSON.parse(cachedWebsite) as RecursiveWebsite;
        } catch {
            return null;
        }
    }

    /**
     * Check if the cached data is too old (older than 1 hour).
     * @private
     */
    private static cacheIsTooOld(): boolean {
        if (!CacheUtil.hasSessionStorage()) return true;
        try {
            const lastUpdate = sessionStorage.getItem("last_update");
            if (!lastUpdate) return true;
            const lastUpdateTime = parseInt(lastUpdate, 10);
            const currentTime = Date.now();
            const oneHour = 60 * 60 * 1000;
            return (currentTime - lastUpdateTime) > oneHour;
        } catch {
            return true;
        }
    }

    /**
     * Get the recursive website data, either from cache or by fetching it from the server.
     * @param domainOrId
     */
    static async getRecursiveWebsite(domainOrId: string): Promise<RecursiveWebsite> {
        const cachedWebsite = this.recoverWebsiteFromCache(domainOrId);
        console.log("retrieved from cache:", cachedWebsite);
        if (cachedWebsite && !this.cacheIsTooOld() && CacheUtil.isCacheActive()) {
            return cachedWebsite;
        } else {
            const website = await this.fetchWebsite(domainOrId);
            this.saveWebsiteInCache(website);
            return website;
        }
    }

    /**
     * Get the CSS properties for a given website, based on its colors.
     * @param websiteId
     */
    public static async getCSSPropertiesForWebsite(websiteId: string): Promise<CSSProperties> {
        const website = await WebsiteService.getRecursiveWebsite(websiteId);
        if (website && website.colors) {
            return CssUtil.websiteColorsToCSS(website.colors);
        } else {
            return CssUtil.websiteColorsToCSS(getDefaultColors(-1) as WebsiteColors);
        }
    }

    static async insertColors(websiteId: number, colors: InsertableWebsiteColors): Promise<void> {
        try {
            await axios.post(`/api/websites/${websiteId}/colors`, colors);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async updateColors(websiteId: number, colors: InsertableWebsiteColors): Promise<void> {
        try {
            await axios.put(`/api/websites/${websiteId}/colors`, colors);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getColors(websiteId: number): Promise<WebsiteColors> {
        try {
            const response = await axios.get(`/api/websites/${websiteId}/colors`);
            return response.data.data as WebsiteColors;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async createNewWebsite(newWebsite: InsertableDisplayWebsite) {
        try {
            const response = await axios.post('/api/me/websites', newWebsite);
            return response.data.data as DisplayWebsite;
        } catch (e) {
            const perso = {code: 409, message: "The page name is already used. Please choose another name."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }

    static async getMyWebsites(): Promise<DisplayWebsite[]> {
        try {
            const response = await axios.get('/api/me/websites');
            return response.data.data as DisplayWebsite[];
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

    static async updateWebsite(editedWebsite: DisplayWebsite) {
        try {
            const response = await axios.put(`/api/websites/${editedWebsite.id}`, editedWebsite);
            return response.data.data as DisplayWebsite;
        } catch (e) {
            const perso = {code: 409, message: "The page name is already used. Please choose another name."}
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1, perso)
        }
    }

    static async getWebsiteById(websiteId: number): Promise<DisplayWebsite> {
        try {
            const response = await axios.get(`/api/websites/${websiteId}`);
            return response.data.data as DisplayWebsite;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}