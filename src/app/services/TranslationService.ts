import {Language, TextToTranslate} from "@/app/models/TextToTranslate";
import axios, {AxiosError} from "axios";
import StringUtil from "@/app/utils/StringUtil";
import StorageUtil from "@/app/utils/StorageUtil";
import CacheUtil from "@/app/utils/CacheUtil";
import Translation, {InsertableTranslation} from "@/app/models/Translation";
import {DisplayWebsite} from "@/app/models/DisplayWebsite";
import {Page} from "@/app/models/Page";

export default class TranslationService {

    public static setLanguage(language: Language) {
        if (!StorageUtil.hasLocalStorage()) return;
        localStorage.setItem("lang", language);
    }

    public static getLanguage(): Language {
        if (!StorageUtil.hasLocalStorage()) return Language.FRENCH;
        const lang = localStorage.getItem("lang");
        if (lang === null) {
            return Language.FRENCH; // Default to French if not set
        }
        return lang as Language;
    }

    static async getTranslatedWebsite(websiteId: number): Promise<DisplayWebsite> {
        const language = this.getLanguage();

        const cacheKey = `translation_website_${websiteId}_${language}`;
        if (StorageUtil.hasLocalStorage()) {
            const cachedTranslation = localStorage.getItem(cacheKey);
            if (cachedTranslation) {
                return JSON.parse(cachedTranslation);
            }
        }
        try {
            const response = await axios.get(`/api/websites/${websiteId}/translate/${language}`);

            const data = response.data.data as DisplayWebsite;
            if (StorageUtil.hasLocalStorage()) {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return data;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getTranslatedPage(pageId: number): Promise<Page> {
        const language = this.getLanguage();

        const cacheKey = `translation_page_${pageId}_${language}`;
        if (StorageUtil.hasLocalStorage()) {
            const cachedTranslation = localStorage.getItem(cacheKey);
            if (cachedTranslation) {
                return JSON.parse(cachedTranslation);
            }
        }
        try {
            const response = await axios.get(`/api/pages/${pageId}/translate/${language}`);

            const data = response.data.data as Page;
            if (StorageUtil.hasLocalStorage()) {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return data;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getTranslatedElement(elementId: number): Promise<Translation> {
        const language = this.getLanguage();

        const cacheKey = `translation_element_${elementId}_${language}`;
        if (StorageUtil.hasLocalStorage()) {
            const cachedTranslation = localStorage.getItem(cacheKey);
            if (cachedTranslation) {
                return JSON.parse(cachedTranslation);
            }
        }
        try {
            const response = await axios.get(`/api/elements/${elementId}/translate/${language}`);

            const data = response.data.data as Translation;
            if (StorageUtil.hasLocalStorage()) {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return data;
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}