import {WebsiteColors} from "@/app/models/WebsiteColors";
import {CSSProperties} from "react";
import ColorUtil from "@/app/utils/ColorUtil";
import StringUtil from "@/app/utils/StringUtil";
import axios, {AxiosError} from "axios";
import {Website} from "@/app/models/Website";

/**
 * Utilitaire pour manipuler du css
 */
export default class CssUtil {

    /**
     * permet de convertir les données contenues dans un objet WebsiteColors en propriétés CSS utilisables dans une feuille de style
     * @param colors les couleurs d'un site web
     */
    public static websiteColorsToCSS(colors: WebsiteColors): CSSProperties {
        return {
            '--primary': colors.primary,
            '--primary-variant': colors.primary_variant,
            '--secondary': colors.secondary,
            '--secondary-variant': colors.secondary_variant,
            '--background': colors.background,
            '--background-variant': colors.background_variant,
            '--foreground': colors.foreground,
            '--foreground-variant': colors.foreground_variant,
        } as React.CSSProperties & { [key: string]: string };
    }

    public static async getCSSPropertiesFromImage(imageSrc: string | undefined = "/img/mountain.jpg"): Promise<CSSProperties> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const url = imageSrc.startsWith("http") ? imageSrc : baseUrl+imageSrc;
            const response = await axios.post('/api/colors', {"imageSrc": url});
            const colors = response.data.data as WebsiteColors;
            return CssUtil.websiteColorsToCSS(colors);
        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }


}