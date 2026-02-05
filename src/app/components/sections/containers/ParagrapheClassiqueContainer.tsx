"use client"

import ParagrapheClassique from "@/app/components/sections/ParagrapheClassique";
import {RecursiveSection} from "@/app/models/Section";

/**
 * Un paragraphe classique est un moyen de reppresentation d'une section. Un paragraphe classique container permet de regrouper plusieurs sections de type classique. Il affiche les sections les unes en dessous des autres, avec un espacement entre elles.
 * @param sections
 * @constructor
 */
export default function ParagraphClassiqueContainer({sections}: {sections: RecursiveSection[]}) {
    return (
        <div key={sections[0]?.id || 0} className={" p-0 pt-16 md:pt-32 flex flex-col justify-center items-center gap-32"}>
            {
                sections?.map((section) => {
                    return (
                        <ParagrapheClassique section={section} key={section.id}/>
                    )
                })
            }
        </div>
    )
}