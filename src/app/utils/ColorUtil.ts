import {WebsiteColors} from "@/app/models/WebsiteColors";
import { Vibrant } from "node-vibrant/node";

/**
 * Utilitaire pour gérer les couleurs
 */
export default class ColorUtil {

    static darkenHex(hexColor: string, amount: number = 0.2): string {
        // 1. Nettoyer la chaîne (retirer le '#')
        const hex = hexColor.replace('#', '');

        // Vérification basique de la longueur
        if (hex.length !== 6) {
            throw new Error("Format hexadécimal invalide. Utilisez le format 6 caractères (ex: FF0000).");
        }

        // 2. Convertir chaque composante (R, G, B) de l'hexadécimal vers un entier (0-255)
        // substring(0, 2) prend les deux premiers caractères pour le Rouge
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // 3. Appliquer l'assombrissement
        // On multiplie par (1 - amount) et on arrondit à l'entier inférieur
        r = Math.floor(r * (1 - amount));
        g = Math.floor(g * (1 - amount));
        b = Math.floor(b * (1 - amount));

        // 4. S'assurer que les valeurs restent positives (pas en dessous de 0)
        r = Math.max(0, r);
        g = Math.max(0, g);
        b = Math.max(0, b);

        // 5. Reconvertir en hexadécimal
        // padStart(2, '0') assure qu'on a bien "05" et pas juste "5" si le chiffre est petit
        const rr = r.toString(16).padStart(2, '0');
        const gg = g.toString(16).padStart(2, '0');
        const bb = b.toString(16).padStart(2, '0');

        return `#${rr}${gg}${bb}`;
    }

    static lightenHex(hexColor: string, amount: number = 0.2): string {
        // 1. Nettoyer la chaîne
        const hex = hexColor.replace('#', '');

        if (hex.length !== 6) {
            throw new Error("Format hexadécimal invalide. Utilisez 6 caractères.");
        }

        // 2. Convertir en entiers (0-255)
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // 3. Appliquer l'éclaircissement (Mélange avec du blanc)
        // Formule : Valeur Actuelle + (Espace restant jusqu'à 255 * Pourcentage)
        r = Math.round(r + (255 - r) * amount);
        g = Math.round(g + (255 - g) * amount);
        b = Math.round(b + (255 - b) * amount);

        // 4. S'assurer que les valeurs ne dépassent pas 255 (le blanc pur)
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);

        // 5. Reconvertir en hexadécimal
        const rr = r.toString(16).padStart(2, '0');
        const gg = g.toString(16).padStart(2, '0');
        const bb = b.toString(16).padStart(2, '0');

        return `#${rr}${gg}${bb}`;
    }


    static autoContrastHex(hexColor: string, amount: number = 0.2, threshold: number = 128): string {
        const hex = hexColor.replace('#', '');

        if (hex.length !== 6) throw new Error("Format invalide (6 caractères requis)");

        // 1. Extraction RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // 2. Calcul de la luminosité perçue (Formule standard W3C/YIQ)
        // Le vert pèse plus lourd car l'œil y est plus sensible.
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // 3. Décision : Est-ce clair ou sombre ?
        const isLight = brightness > threshold;

        // 4. Application de la modification
        if (isLight) {
            return this.darkenHex(hexColor, amount);
        } else {
            return this.lightenHex(hexColor, amount);
        }
    }

    static async getColorsFromImage(src: string): Promise<WebsiteColors> {
        // 1. Récupération de l'image en tant que Buffer (nécessaire pour l'environnement Node)
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Extraction de la palette depuis le buffer
        const palette = await Vibrant.from(buffer).getPalette();

        const fallback = '#ffffff';

        // 3. Construction de l'objet de couleurs
        return {
            primary: this.darkenHex(palette.Vibrant?.hex || fallback, 0.3),
            primary_variant: this.autoContrastHex(palette.Vibrant?.hex || fallback, 0.4),

            secondary: this.darkenHex(palette.Muted?.hex || fallback, 0.3),
            secondary_variant: this.autoContrastHex(palette.Muted?.hex || fallback, 0.4),

            foreground: this.darkenHex(palette.DarkMuted?.hex || fallback, 0.3),
            foreground_variant: this.autoContrastHex(palette.DarkMuted?.hex || fallback, 0.4),

            background: this.lightenHex(palette.LightMuted?.hex || fallback, 0.3),
            background_variant: this.autoContrastHex(palette.LightMuted?.hex || fallback, 0.4),
        };
    }



}