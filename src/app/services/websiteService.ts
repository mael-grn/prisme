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
        localStorage.setItem("cache_active", "false");
    }

    public static enable_cache() {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem("cache_active", "true");
    }

    public static isCacheActive(): boolean {
        if (!this.hasLocalStorage()) {
            return true;
        } // default when no client storage
        const cacheSetting = localStorage.getItem("cache_active");
        if (cacheSetting === null) {
            return true; // Default to true if not set
        }
        return cacheSetting === "true";
    }

    private static async fetchWebsite(idOrDomain : string): Promise<RecursiveWebsite> {
        try {
            const response = await axios.get(`/api/website/${idOrDomain}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch data for domain : ${error}`);
        }
    }

    private static saveWebsiteInCache(website: RecursiveWebsite) {
        if (!this.hasSessionStorage()) return;
        try {
            sessionStorage.setItem("cached_website_" + website.title.toLowerCase(), JSON.stringify(website));
            sessionStorage.setItem("cached_website_" + website.id, JSON.stringify(website));
            sessionStorage.setItem("last_update", Date.now().toString());
        } catch {
            // ignore storage errors (quota, etc.)
        }
    }

    private static recoverWebsiteFromCache(domainOrId: string): RecursiveWebsite | null {
        if (!this.hasSessionStorage()) return null;
        try {
            const cachedWebsite = sessionStorage.getItem("cached_website_" + domainOrId);
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

    static async getRecursiveWebsite(domainOrId: string): Promise<RecursiveWebsite> {
        const cachedWebsite = this.recoverWebsiteFromCache(domainOrId);
        console.log("retrieved from cache:", cachedWebsite);
        if (cachedWebsite && !this.cacheIsTooOld() && this.isCacheActive()) {
            return cachedWebsite;
        } else {
            const website = await this.fetchWebsite(domainOrId);
            this.saveWebsiteInCache(website);
            return website;
        }
    }
}