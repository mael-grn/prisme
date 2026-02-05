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