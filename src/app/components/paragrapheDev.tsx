"use client";

import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {RecursiveSection} from "@/app/models/Section";
import ElementComponent from "@/app/components/elementComponent";

export default function ParagrapheDev({section}: { section: RecursiveSection }) {
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
                            key={"background-blur-" + section.id}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            onClick={() => setFullScreen(false)}
                            className={"fixed  z-30 top-0 left-0 w-full h-[100vh] backdrop-blur bg-backgroundOpacity"}/>

                        <motion.div
                            key={"big-element-" + section.id}
                            initial={{transform: "scale(0)", opacity: 0, transformOrigin: "bottom"}}
                            animate={{transform: "scale(1)", opacity: 1, transformOrigin: "bottom"}}
                            exit={{transform: "scale(0)", opacity: 0, transformOrigin: "bottom"}}
                            style={{scrollbarWidth: "none"}}
                            className={`fixed bottom-0 h-[80vh] min-h-[80vh] max-h-[80vh] box-border z-40 md:w-3/4 w-full md:left-[12.5%] left-0  bg-onBackground overflow-auto rounded-t-3xl `}
                        >
                            <div className={"sticky top-0 right-0 p-2 z-50 w-full flex justify-end"}>

                                <div onClick={() => setFullScreen(false)} className={"flex cursor-pointer bg-dangerous active:bg-dangerousHover md:hover:bg-dangerousHover rounded-3xl justify-center items-center w-fit h-fit p-2"}>
                                    <img src={"/ico/close-outline.svg"} alt={"close"} className={"w-6 h-6"}/>
                                </div>
                            </div>



                            <div className={"flex flex-col gap-10 items-center p-8"}>

                                <div className={"flex w-full flex-wrap gap-2 items-center justify-center"}>
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
                                        return <ElementComponent delay={index*0.1} reduceImageSize={true} key={index} element={element} center={true}/>
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
                key={section.id}
                onClick={() => setFullScreen(true)}
                initial={{opacity: 0, transform: "translateY(20px)"}}
                whileInView={{opacity: 1, transform: "translateY(0px)"}}
                className={`
                            flex flex-col cursor-pointer 
                            relative gap-2 bg-primary w-full h-fit p-4 rounded-xl 
                            overflow-hidden md:hover:bg-primaryHover md:max-w-[800px]
                            `}
            >
                {
                    section.categories.length > 0 &&
                    <div className={"flex flex-wrap w-full gap-1"}>
                        {
                            section.categories.map((tag, id) => {
                                return (
                                    <p key={id}
                                       className={"bg-onBackground pt-1 pb-1 pl-3 pr-3 rounded-3xl text-xs"}>{tag.name}</p>
                                )
                            })
                        }
                    </div>
                }

                {
                    section.elements.length > 0 &&
                    <ElementComponent element={section.elements[0]} inverseColor={true}/>
                }
            </motion.div>
        </>

    )
}