import StorageUtil from "@/app/utils/StorageUtil";

/**
 * utility class for cache
 */
export default class CacheUtil {



    /**
     * does what is says
     */
    public static disable_cache() {
        if (!StorageUtil.hasLocalStorage()) return;
        localStorage.setItem("cache_active", "false");
    }

    /**
     * does what is says
     */
    public static enable_cache() {
        if (!StorageUtil.hasLocalStorage()) return;
        localStorage.setItem("cache_active", "true");
    }

    /**
     * Check if cache has been enabled
     */
    public static isCacheActive(): boolean {
        if (!StorageUtil.hasLocalStorage()) {
            return true;
        } // default when no client storage
        const cacheSetting = localStorage.getItem("cache_active");
        if (cacheSetting === null) {
            return true; // Default to true if not set
        }
        return cacheSetting === "true";
    }
}