"use client"

import Tuile from "@/app/components/sections/Tuile";
import {RecursiveSection} from "@/app/models/Section";

/**
 * Une tuile est une section, un TuileContainer est donc le conteneur de toutes ces sections qui permet de correctement les organiser
 * @param sections les sections, qui doivent être affichées en tuiles
 * @constructor
 */
export default function TuileContainer({sections}: {sections: RecursiveSection[]}) {

    return (
        <div key={sections[0]?.id || 0} className={" mt-10 md:p-6 p-3 rounded-[40px] self-center bg-on-background flex flex-wrap justify-center items-start gap-3 md:gap-4"}>
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