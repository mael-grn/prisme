
/**
 * Utilitaire pour gérer les couleurs
 */
export default class ColorUtil {

    /**
     * Détermine si une couleur hexadécimale est sombre
     * @param hexColor - La couleur en format hexadécimal (ex: "#RRGGBB" ou "RRGGBB")
     */
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

}