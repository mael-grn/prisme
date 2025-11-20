import WebsiteService from "@/app/services/websiteService";

export default class ColorUtil {
    static isColorDark(hexColor: string): boolean {
        if (!hexColor) return false;

        // Normalise la chaîne (supprime espaces et #)
        let hex = hexColor.trim().replace(/^#/, '');

        // Accepte 3 ou 6 caractères hex
        if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return false;

        // Développe les shorthand (e.g. "abc" -> "aabbcc")
        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calcul de la luminosité perçue (formule pondérée)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Seuil commun : < 128 => sombre
        return brightness < 128;
    }

    static async isPrimaryColorDark(domainId: string): Promise<boolean> {
        const website = await WebsiteService.getRecursiveWebsite(domainId)
        if (!website || !website.colors || !website.colors.primary_color) return false;
        return this.isColorDark(website.colors.primary_color);
    }

    static async isBackgroundColorDark(domainId: string): Promise<boolean> {
        const website = await WebsiteService.getRecursiveWebsite(domainId)
        if (!website || !website.colors || !website.colors.background_color) return false;
        return this.isColorDark(website.colors.background_color);
    }

    static async isSecondaryColorDark(domainId: string): Promise<boolean> {
        const website = await WebsiteService.getRecursiveWebsite(domainId)
        if (!website || !website.colors || !website.colors.secondary_color) return false;
        return this.isColorDark(website.colors.secondary_color);
    }
}