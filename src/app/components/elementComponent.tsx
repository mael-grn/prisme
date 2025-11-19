"use client";

import {Element} from "@/app/models/Element";
import {PossibleElemType} from "@/app/enums/PossibleElemType";
import StringUtil from "@/app/utils/stringUtil";

export default function ElementComponent({element, center = false, reduceImageSize=false} : {element : Element, center?:boolean, inverseColor?:boolean, reduceImageSize?:boolean}) {
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
                className={`w-full max-w-4xl ${center && "text-center"}`}
            >{element.content}</h2>
        case PossibleElemType.texte:
            return <p
                key={element.id}
                className={`w-full max-w-4xl ${center && "text-center"}`}
            >{element.content}</p>
        case PossibleElemType.lien:
            return <a
                key={element.id}
                href={element.content}
                className={`bg-onBackground md:hover:bg-onBackgroundHover py-1 px-3 rounded-full ${center && "text-center"}`}
            >
                {
                    StringUtil.truncateString(element.content.startsWith("https://www.") ? element.content.slice(12) :
                        element.content.startsWith("http://www.") ? element.content.slice(11) :
                            element.content.startsWith("https://") ? element.content.slice(8) :
                                element.content.startsWith("http://") ? element.content.slice(7) :
                                    element.content, 50)
                }
            </a>
    }
}