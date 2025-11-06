import {Element} from "@/app/models/Element";
import {PossibleElemType} from "@/app/enums/PossibleElemType";
import { motion } from "framer-motion";

export default function ElementComponent({element, center = false, inverseColor = false, reduceImageSize=false, delay = 0.0} : {element : Element, center?:boolean, inverseColor?:boolean, reduceImageSize?:boolean, delay?: number}) {
    switch (element.element_type) {
        case PossibleElemType.image:
            return <motion.img
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{delay: delay}}
                key={element.id}
                src={element.content}
                alt={"image"} className={`${reduceImageSize ? "w-1/2" : "w-full"} rounded-xl`}
            />
        case PossibleElemType.titre:
            return <motion.h2
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{delay: delay}}
                key={element.id}
                className={`w-full ${center && "text-center"} ${inverseColor && "text-background"}`}
            >{element.content}</motion.h2>
        case PossibleElemType.texte:
            return <motion.p
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{delay: delay}}
                key={element.id}
                className={`w-full ${center && "text-center"} ${inverseColor && "text-background"}`}
            >{element.content}</motion.p>
        case PossibleElemType.lien:
            return <motion.a
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{delay: delay}}
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
            </motion.a>
    }
}