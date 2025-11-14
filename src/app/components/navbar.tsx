"use client"


import {useEffect, useState} from "react";
import WebsiteService from "@/app/services/websiteService";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion, useMotionValueEvent, useScroll} from "framer-motion";

export default function Navbar({websiteIdOrDomain} : {websiteIdOrDomain: string}) {

    const [developed, setDeveloped]  = useState(false);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);

    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 0);
    });

    const router = useRouter();



    useEffect(() => {
        WebsiteService.getRecursiveWebsite().then((data) => {
            data.pages.push({
                id: 0,
                sections: [],
                path: "/",
                website_id: data.id,
                title: "Accueil",
                position: -2,
            })
            data.pages = data.pages.sort((a, b) => a.position - b.position);
            setWebsite(data);
        })
    }, [websiteIdOrDomain]);

    return (
        <nav className={"fixed top-0 right-0 z-999 flex justify-end"}>

            <button onClick={() => setDeveloped(!developed)} className={`p-2 m-3 z-999 h-fit bg-background md:hover:bg-onBackgroundHover active:bg-onBackgroundHover w-fit rounded-full ${developed && "scale-0 translate-x-100"}  active:scale-90 cursor-pointer flex items-center justify-center`}>
                <p style={{fontWeight: 700}} className={`${scrolled ? "text-[0px] mr-0 ml-0" : "text-[17px] mr-2 ml-2"}`}>Explorer</p>
                <img src={developed ? "/ico/close.svg" : "/ico/hamburger.svg"} alt={"hamburger"} className={`${scrolled ? "w-10 h-10" : "w-6 h-6 mr-2"} invert`}/>
            </button>

            <AnimatePresence>
                {
                    developed &&
                    <motion.ul
                        initial={{opacity: 0, transform: "translateX(50px)"}}
                        animate={{opacity: 1, transform: "translateX(0)"}}
                        exit={{opacity: 0, transform: "translateX(50px)"}}
                        className={`absolute top-0 right-0 h-screen z-99 md:w-[50vw] w-[100vw] gap-4 flex flex-col items-end pr-10 p-4 justify-center bg-gradient-to-r from-transparent to-background bg-transparent`}>
                        <button className={"flex justify-center items-center p-2 rounded-full bg-dangerous absolute top-4 right-4 md:hover:bg-dangerousHover active:bg-dangerousHover active:scale-90 cursor-pointer"} onClick={() => setDeveloped(false)}>
                            <img src={"/ico/close.svg"} alt={"close"} className={"w-6"}/>
                        </button>
                        {
                            website?.pages.map((page, index) => (
                                <motion.li key={index}
                                    initial={{filter: "opacity(0) blur(5px)", transform: "translateX(50px)"}}
                                    animate={{filter: "opacity(1) blur(0px)", transform: "translateX(0px)"}}
                                    exit={{filter: "opacity(0)", transform: "translateX(50px)"}}
                                    transition={{ delay: index * 0.1}}
                                    onClick={() => {
                                        setDeveloped(false);
                                        router.push(page.path)
                                    }}
                                    className={"text-4xl capitalize  md:hover:opacity-100 active:opacity-100 md:hover:-translate-x-2 opacity-50 cursor-pointer"}
                                >
                                    {page.title}
                                </motion.li>
                            ))
                        }
                    </motion.ul>

                }
            </AnimatePresence>






        </nav>
    )
}