import {Generic} from "@/app/models/Generic";

export type ConteneurType = 'section_conteneur' | 'tuile_conteneur' | 'item_conteneur';
export type ElementType = 'titre' | 'texte' | 'lien' | 'image_url' | ConteneurType;

export interface Element extends Generic {
    id: number;
    page_id: number;
    element_type: ElementType;
    position: string;
    content: string;
    lang: string;
    father_element_id?: number;
}

export interface SortedElement extends Generic {
    id: number;
    page_id: number;
    element_type: ElementType;
    position: string;
    content: string;
    lang: string;
    children: SortedElement[];
}

export interface InsertableElement extends Generic {
    page_id: number;
    element_type: ElementType;
    content: string;
    lang?: string | undefined;
    father_element_id?: number;
}

export const sortElements = (elements: Element[]): SortedElement[] => {
    const rootElements: SortedElement[] = [];
    const lookup: { [id: number]: SortedElement } = {};

    // Étape 1 : Initialiser le dictionnaire avec tous les éléments
    // et leur ajouter un tableau "children" vide.
    elements.forEach(el => {
        lookup[el.id] = {
            id: el.id,
            page_id: el.page_id,
            element_type: el.element_type,
            position: el.position,
            content: el.content,
            lang: el.lang,
            children: [] // Initialisation du tableau d'enfants
        };
    });

    // Étape 2 : Construire l'arbre
    elements.forEach(el => {
        const mappedElement = lookup[el.id];

        if (el.father_element_id !== undefined && el.father_element_id !== null) {
            const parent = lookup[el.father_element_id];

            if (parent) {
                // Si le parent existe dans le dictionnaire, on lui ajoute cet enfant
                parent.children.push(mappedElement);
            } else {
                // Cas d'erreur ou d'élément orphelin (le parent n'existe pas dans la liste)
                // On le traite comme un élément racine par défaut
                rootElements.push(mappedElement);
            }
        } else {
            // S'il n'y a pas de father_element_id, c'est un élément racine
            rootElements.push(mappedElement);
        }
    });

    // Étape 3 : Optionnel - Trier les enfants par position si nécessaire
    // Si votre propriété "position" sert à l'ordre (ex: "1", "2" ou "A", "B")
    const sortPosition = (a: SortedElement, b: SortedElement) => a.position.localeCompare(b.position);

    // Tri des éléments racine
    rootElements.sort(sortPosition);

    // Tri récursif de tous les enfants dans le dictionnaire
    Object.values(lookup).forEach(el => {
        el.children.sort(sortPosition);
    });

    return rootElements;
};