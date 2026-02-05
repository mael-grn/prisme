export default class CacheUtil {
    public static hasLocalStorage(): boolean {
        try {
            return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
        } catch {
            return false;
        }
    }

    public static hasSessionStorage(): boolean {
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
}