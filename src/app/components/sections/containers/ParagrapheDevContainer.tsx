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
        <div key={sections[0]?.id || 0} className={"  mt-10 md:mt-20 p-4 rounded-[40px] bg-on-background flex w-full flex-col justify-start items-start gap-2"}>
            {
                sections?.map((section, index) => {
                    return (
                        <ParagrapheDev section={section} isFisrt={index==0 && sections.length > 1} isLast={index == sections.length - 1 && sections.length > 1} key={section.id}/>
                    )
                })
            }
        </div>
    )
}