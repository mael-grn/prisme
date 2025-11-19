import {getDefaultColors, WebsiteColors} from "@/app/models/WebsiteColors";
import {CSSProperties} from "react";
import WebsiteService from "@/app/services/websiteService";

export default class CssUtil {
    private static websiteColorsToCSS(colors: WebsiteColors): CSSProperties {
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
        } as CSSProperties;
    }

    public static async getCSSPropertiesForWebsite(websiteId: string): Promise<CSSProperties> {
        const website = await WebsiteService.getRecursiveWebsite(websiteId);
        if (website && website.colors) {
            return this.websiteColorsToCSS(website.colors);
        } else {
            return this.websiteColorsToCSS(getDefaultColors(-1) as WebsiteColors);
        }
    }
}