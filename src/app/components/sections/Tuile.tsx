"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RecursiveSection } from "@/app/models/Section";
import ElementComponent from "@/app/components/page-elements/ElementComponent";
import { simpleElementVariant } from "@/app/utils/FramerUtil";

/**
 * Tuile component that displays a section in a tile format.
 * @param section
 * @param delay - optional delay for the animation
 * @constructor
 */
export default function Tuile({ section, delay = 0.0 }: { section: RecursiveSection, delay?: number }) {

    // State to manage full screen mode when the tile is clicked
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [tileHovered, setTileHovered] = useState<boolean>(false);

    const targetElement = useRef<HTMLDivElement>(null);

    // Effect to check if the section should be displayed in full screen based on the URL hash
    useEffect(() => {
        if (window.location.hash === `#${section.id}`) {
            setFullScreen(true);
        }
        if (window.location.hash === `#${section.id}` && targetElement && targetElement.current) {
            setFullScreen(true);
            targetElement.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [section.id]);

    return (
        <>
            <AnimatePresence>
                {fullScreen && (
                    <>
                        <motion.span
                            key={"background-blur-" + section.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFullScreen(false)}
                            className={"fixed md:z-999 z-999 top-0 left-0 w-full h-screen bg-background-opacity"}
                        />

                        {/* GRANDE TUILE */}
                        <motion.div
                            key={"big-element-" + section.id}
                            layoutId={`card-${section.id}`}
                            transition={{ ease: "easeInOut"}}
                            className={`fixed md:top-[10vh] top-[5vh] md:h-[88vh] md:min-h-[88vh] md:max-h-[88vh] h-[90vh] min-h-[90vh] max-h-[90vh] box-border md:z-999 z-999 md:w-1/3 w-[90%] md:left-1/3 left-[5%] flex flex-col bg-background border-3 scrollbar-hide border-on-background-hover overflow-auto overscroll-none rounded-3xl items-center`}
                        >
                            {/* Le contenu interne peut avoir besoin d'un délai pour apparaître proprement après l'expansion */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full h-full flex flex-col items-center"
                            >
                                <div className={"sticky top-0 right-0 p-2 z-50 w-full flex flex-col"}>
                                    <div className={"w-full flex justify-end bg-background"}>
                                        <div className={"flex flex-1 w-full gap-2 flex-col flex-wrap"}>
                                            {section.categories.map((category, id) => {
                                                return (
                                                    <div key={id} className={"flex gap-2 truncate w-fit rounded-full bg-on-backgroundHover"}>
                                                        <p className={"pt-1 pb-1 pl-2 pr-2 rounded-full text-background bg-primary"}>{category.name}</p>
                                                        {category.subcategories.map((subcat, subId) => {
                                                            return <p className={"pt-1 pb-1 pl-2 pr-2 rounded-full bg-on-background"} key={subId}>{subcat.name}</p>
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div onClick={(e) => { e.stopPropagation(); setFullScreen(false); }}
                                             className={"flex transition-all cursor-pointer active:bg-dangerous-hover active:scale-90 bg-dangerous md:hover:bg-dangerous-hover rounded-3xl justify-center h-8 w-8 min-h-8 max-h-8 min-w-8 max-w-8 items-center p-2 z-50"}>
                                            <img src={"/ico/close-outline.svg"} alt={"close"} className={"w-6 h-6"} />
                                        </div>
                                    </div>
                                    <span className={"w-full h-16 bg-linear-to-b from-background to-transparent"}/>
                                </div>


                                <div className={"flex flex-col gap-10 items-center px-8 pb-8"}>

                                    {section.elements.map((element, index) => {
                                        return <ElementComponent key={index} element={element} reduceImageSize={true} />
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* PETITE TUILE */}
            <motion.div
                ref={targetElement}
                id={`${section.id}`}
                key={"small-element-" + section.id}
                layoutId={`card-${section.id}`}
                onMouseEnter={() => setTileHovered(true)}
                onMouseLeave={() => setTileHovered(false)}
                onClick={() => setFullScreen(true)}
                initial="hidden"
                whileInView="visible"
                whileHover={{scale: 1.05}}
                variants={simpleElementVariant}
                style={{ opacity: fullScreen ? 0 : 1 }}
                transition={{ ease: "easeInOut"}}

                className={`
                border-2 border-primary-hover
                    flex flex-col cursor-pointer  relative
                    items-center gap-2 bg-primary flex-1 max-w-30 min-w-37.5 h-50 md:max-w-50 md:min-w-50 md:h-75 p-4 rounded-[35px] 
                    overflow-hidden
                `}
            >
                {section.elements.map((element, index) => {
                    return <ElementComponent key={index} element={element} mini={true} />
                })}

                <span className={`absolute w-full ${tileHovered ? "h-full" : "h-32"} transition-all bottom-0 left-0 bg-linear-to-t from-primary-hover to to-transparent`}/>
            </motion.div>
        </>
    )
}