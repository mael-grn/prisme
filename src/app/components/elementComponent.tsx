"use client";

import {Element} from "@/app/models/Element";
import {PossibleElemType} from "@/app/enums/PossibleElemType";

export default function ElementComponent({element, center = false, inverseColor = false, reduceImageSize=false} : {element : Element, center?:boolean, inverseColor?:boolean, reduceImageSize?:boolean}) {
    switch (element.element_type) {
        case PossibleElemType.image:
            return <img
                key={element.id}
                src={element.content}
                alt={"image"} className={`${reduceImageSize ? "w-fit h-fit max-w-1/2 max-h-[700px]" : "w-full"} object-contain rounded-xl`}
            />
        case PossibleElemType.titre:
            return <h2
                key={element.id}
                className={`w-full ${center && "text-center"} ${inverseColor && "text-background"}`}
            >{element.content}</h2>
        case PossibleElemType.texte:
            return <p
                key={element.id}
                className={`w-full ${center && "text-center"} ${inverseColor && "text-background"}`}
            >{element.content}</p>
        case PossibleElemType.lien:
            return <a
                key={element.id}
                href={element.content}
                className={`${center && "text-center"} ${inverseColor && "text-background"}`}
            >
                {
                    element.content.startsWith("https://www.") ? element.content.slice(12) :
                        element.content.startsWith("http://www.") ? element.content.slice(11) :
                            element.content.startsWith("https://") ? element.content.slice(8) :
                                element.content.startsWith("http://") ? element.content.slice(7) :
                                    element.content
                }
            </a>
    }
}