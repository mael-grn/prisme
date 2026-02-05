import {getDefaultColors, WebsiteColors} from "@/app/models/WebsiteColors";
import {CSSProperties} from "react";
import WebsiteService from "@/app/services/WebsiteService";

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
            '--primary': colors.primary_color,
            '--primary-hover': colors.primary_variant,
            '--secondary': colors.secondary_color,
            '--secondary-hover': colors.secondary_variant,
            '--background': colors.background_color,
            '--background-opacity': "rgba(0, 0, 0, 0.75)",
            '--on-background': colors.background_variant,
            '--on-background-hover': colors.background_variant_variant,
            '--foreground': colors.text_color,
            '--on-foreground': colors.text_variant,
            '--on-foreground-hover': colors.text_variant_variant,
            '--dangerous': "#c53854",
            '--dangerous-hover': "#A91D3A",
            '--safe': "#5ca6b3",
            '--safe-hover': "#2F7C8A"
        } as React.CSSProperties & { [key: string]: string };
    }


}