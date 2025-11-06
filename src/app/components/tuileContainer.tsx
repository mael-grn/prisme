"use client"

import Tuile from "@/app/components/tuile";
import {RecursiveSection} from "@/app/models/Section";

export default function TuileContainer({sections}: {sections: RecursiveSection[]}) {

    return (
        <div key={sections[0]?.id || 0} className={" p-0 pt-16 md:pt-32 flex flex-wrap justify-center items-center gap-4"}>
            {
                sections?.map((section, index) => {
                    return (
                        <Tuile section={section} delay={index*0.1} key={index}/>
                    )
                })
            }
        </div>
    )
}