interface ElementWithPosition {
    id: number;
    position: string;
}

export class LexicalPositionUtil {
    private static readonly BASE_CHAR = 'a';
    private static readonly MAX_CHAR = 'z';

    // 1. Trier par position
    static sortByPosition<T extends ElementWithPosition>(elements: T[]): T[] {
        return [...elements].sort((a, b) => a.position.localeCompare(b.position));
    }

    // 2. Trouver la position après le dernier élément
    static getNextPosition(elements: ElementWithPosition[]): string {
        if (elements.length === 0) return this.BASE_CHAR;
        const last = this.sortByPosition(elements).pop()!.position;
        return last + this.BASE_CHAR;
    }

    // 3. Calculer une position entre deux strings (ex: entre "a" et "b" -> "an")
    static getPositionBetween(before: string | null, after: string | null): string {
        if (!before) return String.fromCharCode(after!.charCodeAt(0) - 1) || 'a';
        if (!after) return before + this.BASE_CHAR;

        // Logique simplifiée pour générer une valeur intermédiaire
        let newPos = before;
        while (newPos < after) {
            const next = newPos + this.BASE_CHAR;
            if (next < after) {
                newPos = next;
            } else {
                return newPos + String.fromCharCode(before.charCodeAt(before.length - 1) + 1);
            }
        }
        return newPos;
    }

    // 4. Déplacer un élément (réajuste les positions)
    static moveElement<T extends ElementWithPosition>(
        elements: T[],
        elementId: number, // Index dans le tableau
        steps: number
    ): T[] {
        const sorted = this.sortByPosition(elements);
        const item = sorted.splice(elementId, 1)[0];
        const newIndex = Math.max(0, Math.min(sorted.length, elementId + steps));

        sorted.splice(newIndex, 0, item);

        // Réassignation des positions pour maintenir l'ordre lexicographique
        return sorted.map((el, index) => ({
            ...el,
            position: String.fromCharCode(97 + index) // Simple conversion index -> 'a', 'b', 'c'...
        }));
    }

    /**
     * Calcule une position cible en fonction d'un élément de référence
     * @param allElements
     * @param targetId La position de l'élément que l'on veut déplacer
     * @param referenceId La position de l'élément cible (celui au-dessus ou en-dessous)
     * @param direction 'up' | 'down'
     */
    static getPositionRelative(
        allElements: ElementWithPosition[],
        targetId: number,
        referenceId: number,
        direction: 'up' | 'down'
    ): string {
        const sorted = this.sortByPosition(allElements);
        const targetIndex = sorted.findIndex(e => (e as ElementWithPosition).id === targetId);
        const refIndex = sorted.findIndex(e => (e as ElementWithPosition).id === referenceId);

        if (direction === 'up') {
            // On veut se placer juste au-dessus de refIndex
            const before = sorted[refIndex - 1]?.position || null;
            const after = sorted[refIndex].position;
            return this.getPositionBetween(before, after);
        } else {
            // On veut se placer juste en-dessous de refIndex
            const before = sorted[refIndex].position;
            const after = sorted[refIndex + 1]?.position || null;
            return this.getPositionBetween(before, after);
        }
    }
}