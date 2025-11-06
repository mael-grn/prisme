import {RecursiveSection} from "@/app/models/Section";

export const ErrorElement : RecursiveSection = {
    id: 0,
    page_id: 0,
    position: 1,
    section_type: "classic",
    elements: [
        {
            id: 0,
            section_id: 0,
            content: "/img/error.svg",
            position: 1,
            element_type: "image",
        },
        {
            id: 1,
            section_id: 0,
            content: "Oups, quelque chose s'est mal passé...",
            position: 2,
            element_type: "titre",
        },
        {
            id: 2,
            section_id: 0,
            content: "Une erreur est survenue. Veuillez réessayer plus tard.",
            position: 3,
            element_type: "texte",
        }
    ],
    categories: []
}

export const EmptyElement : RecursiveSection = {
    id: 0,
    page_id: 0,
    position: 1,
    section_type: "classic",
    elements: [
        {
            id: 0,
            content: "/img/desert.svg",
            position: 1,
            section_id: 0,
            element_type: "image",
        },
        {
            id: 1,
            content: "Hum, ça semble bien tranquille ici...",
            position: 2,
            section_id: 0,
            element_type: "titre",
        },
        {
            id: 2,
            content: "Aucun contenu n'est disponible pour le moment. Merci de réessayer plus tard.",
            position: 3,
            section_id: 0,
            element_type: "texte",
        }
    ],
    categories: [],
}

export const NoResultElement : RecursiveSection = {
    id: 0,
    page_id: 0,
    position: 1,
    section_type: "classic",
    elements: [
        {
            id: 0,
            content: "/img/desert.svg",
            position: 1,
            section_id: 0,
            element_type: "image",
        },
        {
            id: 1,
            content: "Hum, il semble que rien ne corresponde à votre recherche...",
            position: 2,
            section_id: 0,
            element_type: "titre",
        },
        {
            id: 2,
            content: "Aucun résultat n'a été trouvé pour votre recherche. Réessayez avec un autre terme ou une autre expression.",
            position: 3,
            section_id: 0,
            element_type: "texte",
        }
    ],
    categories: [],
}

export const SearchElement : RecursiveSection = {
    id: 0,
    page_id: 0,
    position: 1,
    section_type: "classic",
    elements: [
        {
            id: 0,
            content: "/img/search.svg",
            position: 1,
            section_id: 0,
            element_type: "image",
        },
        {
            id: 1,
            content: "Rechercher",
            position: 2,
            section_id: 0,
            element_type: "titre",
        },
        {
            id: 2,
            content: "Recherchez un terme ou une expression pour obtenir des résultats.",
            position: 3,
            section_id: 0,
            element_type: "texte",
        }
    ],
    categories: [],
}