"use client";

import {useEffect, useRef, useState} from "react";
import {RecursiveSection} from "@/app/models/Section";
import ElementComponent from "@/app/components/elementComponent";


export default function ParagrapheClassique({section} : {section: RecursiveSection}) {

    const [highLighted, setHighLighted] = useState(false);
    const targetElement = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (window.location.hash === `#${section.id}`) {
            setHighLighted(true);
        }
        if (window.location.hash === `#${section.id}` && targetElement && targetElement.current) {
            setHighLighted(true);
            targetElement.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [section.id, targetElement]);

    return (
        <div
            ref={targetElement}
            key={section.id}
            className={`flex flex-col md:w-2/3  justify-start items-start gap-6 rounded-xl ${highLighted ? "bg-safe" : "bg-transparent"}`}
        >
            {
                section.elements.map((element, index) => {
                    return <ElementComponent key={index} element={element} reduceImageSize={true}/>
                })
            }
        </div>
    )

}