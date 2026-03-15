/**
 * utility class for cache
 */
export default class CacheUtil {

    /**
     * Check if we are running in a browser, as cache is only useful for users
     */
    public static hasLocalStorage(): boolean {
        try {
            return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
        } catch {
            return false;
        }
    }

    /**
     * Check if we are running in a browser, as cache is only useful for users
     */
    public static hasSessionStorage(): boolean {
        try {
            return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
        } catch {
            return false;
        }
    }

    /**
     * does what is says
     */
    public static disable_cache() {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem("cache_active", "false");
    }

    /**
     * does what is says
     */
    public static enable_cache() {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem("cache_active", "true");
    }

    /**
     * Check if cache has been enabled
     */
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
}