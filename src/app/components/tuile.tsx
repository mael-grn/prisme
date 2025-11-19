"use client";

import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {RecursiveSection} from "@/app/models/Section";
import ElementComponent from "@/app/components/elementComponent";

export default function Tuile({section, delay=0.0}: { section: RecursiveSection, delay?: number }) {
    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const targetElement = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (window.location.hash === `#${section.id}`) {
            setFullScreen(true);
        }
        if (window.location.hash === `#${section.id}` && targetElement && targetElement.current) {
            setFullScreen(true);
            targetElement.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [section.id, targetElement]);

    return (
        <>
            <AnimatePresence>
                {fullScreen &&
                    <>
                        <motion.span
                            key={"background-blur-"+section.id}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            onClick={() => setFullScreen(false)}
                            className={"fixed  md:z-30 z-50 top-0 left-0 w-full h-[100vh] backdrop-blur bg-backgroundOpacity"}/>

                        <motion.div
                            key={"big-element-"+section.id}
                            initial={{transform: "scale(.7)", opacity: 0, filter: "blur(20px)"}}
                            animate={{transform: "scale(1)", opacity: 1, filter: "blur(0px)"}}
                            exit={{transform: "scale(.7)", opacity: 0, filter: "blur(20px)"}}
                            style={{scrollbarWidth: "none"}}
                            className={`fixed md:top-[10vh] top-[5vh] md:h-[88vh] md:min-h-[88vh] md:max-h-[88vh] h-[90vh] min-h-[90vh] max-h-[90vh] box-border md:z-40 z-50 md:w-1/3 w-[90%] md:left-1/3 left-[5%] flex flex-col bg-background border-2 border-onBackground overflow-auto rounded-3xl items-center`}
                        >
                            <div className={"sticky top-0 right-0 p-2 z-50 w-full flex justify-end"}>

                                <div onClick={() => setFullScreen(false)} className={"flex cursor-pointer active:bg-dangerousHover active:scale-90 bg-dangerous md:hover:bg-dangerousHover rounded-3xl justify-center items-center p-2 z-50"}>
                                    <img src={"/ico/close-outline.svg"} alt={"close"} className={"w-6 h-6"}/>
                                </div>
                            </div>

                            <div className={"flex flex-col gap-10 items-center p-8"}>
                                <div className={"flex w-full flex-wrap justify-center items-center gap-2"}>
                                    {
                                        section.categories.map((category, id) => {
                                            return (
                                                <div  key={id} className={"flex truncate w-fit gap-2 rounded-3xl p-2 bg-onBackgroundHover"}>
                                                    <p className={"pt-1 pb-1 pl-2 pr-2 rounded-full text-background bg-primary"}>{category.name}</p>
                                                    {
                                                        category.subcategories.map((subcat, subId) => {
                                                            return <p className={"pt-1 pb-1 pl-2 pr-2 rounded-full bg-onBackground"} key={subId}>{subcat.name}</p>
                                                        })
                                                    }
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                                {
                                    section.elements.map((element, index) => {
                                        return <ElementComponent key={index} element={element}/>
                                    })
                                }
                            </div>


                        </motion.div>
                    </>

                }
            </AnimatePresence>
            <motion.div
                ref={targetElement}
                id={`${section.id}`}
                key={"small-element-"+section.id}
                onClick={() => setFullScreen(true)}
                initial={{opacity: 0, transform: "scale(0.8)", filter: "blur(10px)"}}
                whileInView={{opacity: 1, transform: "scale(1)", filter: "blur(0px)"}}
                whileHover={{opacity: 0.8}}
                whileTap={{opacity: 0.8}}
                transition={{delay: delay}}
                className={`
                            flex flex-col cursor-pointer 
                            relative items-center gap-4 bg-primary flex-1 max-w-[120px] min-w-[150px] h-[200px] md:max-w-[200px] md:min-w-[200px] md:h-[300px] p-4 rounded-2xl 
                            overflow-hidden active:bg-primaryHover active:scale-90 md:hover:bg-primaryHover text-background
                            `}
            >
                {
                    section.elements.map((element, index) => {
                        return <ElementComponent key={index} element={element}/>
                    })
                }
            </motion.div>
        </>

    )
}