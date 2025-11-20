export default class SvgUtil {
    static changeSvgColor(svg: string, color: string): string {
        // 1. Déterminer le format de la couleur finale
        let finalColor = color;

        // On vérifie si c'est un code hexadécimal (commence par #)
        // ou une fonction de couleur explicite (rgb, rgba, hsl, etc.)
        const isExplicitColor = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl');

        if (!isExplicitColor) {
            // Si ce n'est pas une couleur explicite, on assume que c'est une variable CSS.
            // On l'enveloppe dans var(--nom-variable)
            finalColor = `var(--${color})`;
        }

        // 2. Création de l'expression régulière (Regex)
        // On cherche 'stroke=' ou 'stop-color=' suivi de n'importe quelle valeur entre guillemets (simples ou doubles).
        // L'option 'g' permet de remplacer toutes les occurrences, pas seulement la première.
        const regex = /(stroke|stop-color)=["']([^"']*)["']/g;

        // 3. Remplacement
        // On remplace la valeur trouvée par la nouvelle couleur formatée
        return svg.replace(regex, `$1="${finalColor}"`);
    }
}