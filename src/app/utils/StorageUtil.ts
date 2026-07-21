export default class StorageUtil {
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
}