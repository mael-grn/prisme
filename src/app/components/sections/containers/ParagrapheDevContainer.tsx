"use client"

import ParagrapheDev from "@/app/components/sections/ParagrapheDev";
import {RecursiveSection} from "@/app/models/Section";

/**
 * Un Paragraphe dev est un type de representation de section. un paragraphe dev container permet de regrouper plusieurs sections de type paragraphe dev. il affiche les sections les unes en dessous des autres, avec un espacement entre elles.
 * @param sections
 * @constructor
 */
export default function ParagraphDevContainer({sections}: {sections: RecursiveSection[]}) {
    return (
        <div key={sections[0]?.id || 0} className={" pt-16 md:pt-32 flex flex-col justify-center items-center gap-6"}>
            {
                sections?.map((section) => {
                    return (
                        <ParagrapheDev section={section} key={section.id}/>
                    )
                })
            }
        </div>
    )
}