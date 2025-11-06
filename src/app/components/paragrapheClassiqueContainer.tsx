"use client"

import ParagrapheClassique from "@/app/components/paragrapheClassique";
import {RecursiveSection} from "@/app/models/Section";

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