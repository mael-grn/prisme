/**
 * Utility class for string manipulation.
 */
export default class StringUtil {

    /**
     * Permet de tronquer une chaîne de caractères à une longueur spécifiée, en ajoutant "..." à la fin si elle dépasse cette longueur.
     * @param str La chaîne de caractères à tronquer.
     * @param num La longueur maximale de la chaîne de caractères. Si la chaîne dépasse cette longueur, elle sera tronquée et "..." sera ajouté à la fin.
     */
    static truncateString(str: string, num: number): string {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }

}