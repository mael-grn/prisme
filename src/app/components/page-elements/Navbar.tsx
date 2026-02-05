"use client"


import {useEffect, useState} from "react";
import WebsiteService from "@/app/services/WebsiteService";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import {useParams, useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import SvgFromString from "@/app/components/ui-elements/SvgFromString";
import Icon from "@/app/components/ui-elements/Icon";

/**
 * Tous simplement la barre de navigation, qui s'adapte ou non au style mobile.
 * @param websiteIdOrDomain L'id ou le domaine du site, nécessaire pour récupérer les pages et les afficher dans la navbar.
 * @constructor
 */
export default function Navbar({websiteIdOrDomain}: { websiteIdOrDomain: string }) {

    const [developed, setDeveloped] = useState(false);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);

    const router = useRouter();
    const {path} = useParams()

    useEffect(() => {
        WebsiteService.getRecursiveWebsite(websiteIdOrDomain).then((data) => {
            data.pages.push({
                id: 0,
                sections: [],
                path: "/",
                website_id: data.id,
                title: "Home",
                position: -2,
            })
            data.pages = data.pages.sort((a, b) => a.position - b.position);
            setWebsite(data);
        })
    }, [websiteIdOrDomain]);

    return (
        <nav className={"fixed top-0 right-0 z-999 flex transition justify-end"}>

            <button onClick={() => setDeveloped(!developed)}
                    className={`${developed ? "gap-0 text-[0px] p-2 bg-dangerous md:hover:bg-dangerous-hover m-10" : "gap-2 text-[18px] px-4 py-2 bg-on-background md:hover:bg-on-background-hover m-3"}   z-999 transition-all h-fit text-foreground  w-fit rounded-full  active:scale-95 cursor-pointer flex items-center justify-center`}>
                {path ? path : "HOME"}
                <Icon iconName={developed ? "close" : "hamburger"} size={6}/>
            </button>

            <AnimatePresence>
                {
                    developed &&
                    <motion.ul
                        initial={{opacity: 0, scale: 0, borderRadius: "500px", transformOrigin: "top right"}}
                        animate={{opacity: 1, scale: 1, borderRadius: "40px", transformOrigin: "top right"}}
                        exit={{opacity: 0, scale: 0, borderRadius: "500px", transformOrigin: "top right"}}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            mass: 1
                        }}
                        className={`absolute top-5 right-5 z-99 max-w-[calc(100vw - 40px)] w-fit gap-4 flex flex-col items-end p-10 pt-20 rounded-[40px] justify-center bg-on-background-hover`}>

                        {
                            website?.pages.map((page, index) => (
                                <motion.li key={index}
                                           initial={{opacity: 0, y: "-50px", x: "0px"}}
                                           animate={{opacity: 0.70, y: "0px", x: "0px"}}
                                           exit={{opacity: 0, y: "-50px", x: "0px"}}
                                           whileHover={{opacity: 1, y: "0px", x: "-10px"}}
                                           transition={{delay: index * 0.05}}
                                           onClick={() => {
                                               setDeveloped(false);
                                               router.push("/" + websiteIdOrDomain + "/" + page.path)
                                           }}
                                           className={"text-4xl flex gap-3 items-center justify-center text-foreground cursor-pointer"}
                                >
                                    {
                                        page.icon_svg ?
                                        <SvgFromString svg={page.icon_svg} className={"w-6"}/> :
                                        path ? <Icon iconName={"document"} size={6}/> : <Icon iconName={"home"} size={6}/>
                                    }
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