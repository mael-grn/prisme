"use client";

import {Element} from "@/app/models/Element";
import {PossibleElemType} from "@/app/enums/PossibleElemType";
import StringUtil from "@/app/utils/StringUtil";
import { motion } from "framer-motion";
import {simpleElementVariant} from "@/app/utils/FramerUtil";
import TranslationService from "@/app/services/TranslationService";
import {useEffect, useState} from "react";

/**
 * Component qui affiche un élément en fonction de son type
 * Permet d'afficher une image, un titre, un texte ou un lien
 * Le composant utilise des animations pour faire apparaître les éléments de manière fluide
 * @param element
 * @param center Permet de centrer le texte ou le titre
 * @param mini
 * @param reduceImageSize Permet de réduire la taille de l'image pour les éléments de type image (utile pour les images qui prennent trop de place)
 * @constructor
 */
export default function ElementComponent({element, center = false, mini=false, reduceImageSize=false} : {element : Element, center?:boolean, inverseColor?:boolean, mini?:boolean, reduceImageSize?:boolean}) {

    const [content, setContent] = useState<string>(element.content);

    useEffect(() => {
        if (element.element_type === PossibleElemType.titre || element.element_type === PossibleElemType.texte) {
            if (element.lang === TranslationService.getLanguage()) {
                return;
            }
            TranslationService.getTranslatedElement(element.id).then((translation) => {
                setContent(translation.content)
            }).catch((error) => {
                console.error(error);
            })
        }
    }, [element.content, element.element_type])

    switch (element.element_type) {
        case PossibleElemType.image:
            return <motion.img
                initial={simpleElementVariant.hidden}
                whileInView={simpleElementVariant.visible}
                key={element.id}
                src={element.content}
                alt={"image"} className={`${mini || reduceImageSize ? "w-fit h-fit max-w-1/2 max-h-175 rounded-[10px]" : "w-full rounded-[20px]"} object-contain `}
            />
        case PossibleElemType.titre:
            return <motion.h2
                initial={simpleElementVariant.hidden}
                whileInView={simpleElementVariant.visible}
                key={element.id}
                className={`w-full ${mini ? "md:text-3xl text-2xl" : "md:text-5xl text-3xl"} font-bold font-boska ${center && "text-center"}`}
            >{content}</motion.h2>
        case PossibleElemType.texte:
            return <motion.p
                initial={simpleElementVariant.hidden}
                whileInView={simpleElementVariant.visible}
                key={element.id}
                className={`w-full ${center && "text-center"}`}
                dangerouslySetInnerHTML={{
                    __html: content.replaceAll('\n', '<br/>')
                }}
            />
        case PossibleElemType.lien:
            return <motion.a
                initial={simpleElementVariant.hidden}
                whileInView={simpleElementVariant.visible}
                key={element.id}
                href={element.content}
                className={`bg-on-background md:hover:bg-on-backgroundHover py-1 px-3 rounded-full ${center && "text-center"}`}
            >
                {
                    StringUtil.truncateString(element.content.startsWith("https://www.") ? element.content.slice(12) :
                        element.content.startsWith("http://www.") ? element.content.slice(11) :
                            element.content.startsWith("https://") ? element.content.slice(8) :
                                element.content.startsWith("http://") ? element.content.slice(7) :
                                    element.content, 50)
                }
            </motion.a>
    }
}