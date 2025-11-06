"use client"

import ParagrapheDev from "@/app/components/paragrapheDev";
import {RecursiveSection} from "@/app/models/Section";

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