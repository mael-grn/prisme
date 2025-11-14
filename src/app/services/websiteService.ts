// typescript
import axios from "axios";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";

export default class WebsiteService {
    private static hasLocalStorage(): boolean {
        try {
            return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
        } catch {
            return false;
        }
    }

    private static hasSessionStorage(): boolean {
        try {
            return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
        } catch {
            return false;
        }
    }

    public static disable_cache() {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem("cache_active_p", "false");
    }

    public static enable_cache() {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem("cache_active_p", "true");
    }

    public static isCacheActive(): boolean {
        if (!this.hasLocalStorage()) return true; // default when no client storage
        const cacheSetting = localStorage.getItem("cache_active_p");
        if (cacheSetting === null) {
            return true; // Default to true if not set
        }
        return cacheSetting === "true";
    }

    private static async fetchWebsite(): Promise<RecursiveWebsite> {
        try {
            const response = await axios.get(`/api/website/maelg.fr`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(`Failed to fetch data for domain : ${error.response.status} ${error.response.statusText}`);
            }
            throw new Error(`Something went wrong while fetching data for domain.`);
        }
    }

    private static saveWebsiteInCache(website: RecursiveWebsite) {
        if (!this.hasSessionStorage()) return;
        try {
            sessionStorage.setItem("cached_website_maelg.fr" + website.title, JSON.stringify(website));
            sessionStorage.setItem("last_update", Date.now().toString());
        } catch {
            // ignore storage errors (quota, etc.)
        }
    }

    private static recoverWebsiteFromCache(): RecursiveWebsite | null {
        if (!this.hasSessionStorage()) return null;
        try {
            const cachedWebsite = sessionStorage.getItem("cached_website_maelg.fr");
            if (!cachedWebsite) return null;
            return JSON.parse(cachedWebsite) as RecursiveWebsite;
        } catch {
            return null;
        }
    }

    private static cacheIsTooOld(): boolean {
        if (!this.hasSessionStorage()) return true;
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

    static async getRecursiveWebsite(): Promise<RecursiveWebsite> {
        const cachedWebsite = this.recoverWebsiteFromCache();
        if (cachedWebsite && !this.cacheIsTooOld() && this.isCacheActive()) {
            return cachedWebsite;
        } else {
            const website = await this.fetchWebsite();
            this.saveWebsiteInCache(website);
            return website;
        }
    }
}