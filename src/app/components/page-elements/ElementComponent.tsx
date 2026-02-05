"use client";

import {Element} from "@/app/models/Element";
import {PossibleElemType} from "@/app/enums/PossibleElemType";
import StringUtil from "@/app/utils/StringUtil";
import { motion } from "framer-motion";

/**
 * Component qui affiche un élément en fonction de son type
 * Permet d'afficher une image, un titre, un texte ou un lien
 * Le composant utilise des animations pour faire apparaître les éléments de manière fluide
 * @param element
 * @param center Permet de centrer le texte ou le titre
 * @param reduceImageSize Permet de réduire la taille de l'image pour les éléments de type image (utile pour les images qui prennent trop de place)
 * @constructor
 */
export default function ElementComponent({element, center = false, reduceImageSize=false} : {element : Element, center?:boolean, inverseColor?:boolean, reduceImageSize?:boolean}) {
    switch (element.element_type) {
        case PossibleElemType.image:
            return <motion.img
                initial={{opacity: 0, transform: "translateY(20px)", filter: "blur(10px)"}}
                whileInView={{opacity: 1, transform: "translateY(0px)", filter: "blur(0px)"}}
                key={element.id}
                src={element.content}
                alt={"image"} className={`${reduceImageSize ? "w-fit h-fit max-w-1/2 max-h-175" : "w-full"} object-contain rounded-xl`}
            />
        case PossibleElemType.titre:
            return <motion.h2
                initial={{opacity: 0, transform: "translateY(20px)", filter: "blur(10px)"}}
                whileInView={{opacity: 1, transform: "translateY(0px)", filter: "blur(0px)"}}
                key={element.id}
                className={`w-full max-w-4xl ${center && "text-center"}`}
            >{element.content}</motion.h2>
        case PossibleElemType.texte:
            return <motion.p
                initial={{opacity: 0, transform: "translateY(20px)", filter: "blur(10px)"}}
                whileInView={{opacity: 1, transform: "translateY(0px)", filter: "blur(0px)"}}
                key={element.id}
                className={`w-full max-w-4xl ${center && "text-center"}`}
                dangerouslySetInnerHTML={{
                    __html: element.content.replaceAll('\n', '<br/>')
                }}
            />
        case PossibleElemType.lien:
            return <motion.a
                initial={{opacity: 0, transform: "translateY(20px)", filter: "blur(10px)"}}
                whileInView={{opacity: 1, transform: "translateY(0px)", filter: "blur(0px)"}}
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