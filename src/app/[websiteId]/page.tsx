"use client"

import {useEffect, useState} from "react";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import AdvancedPopup from "@/app/components/advancedPopup";
import LoadingPopup from "@/app/components/loadingPopup";
import WebsiteService from "@/app/services/websiteService";
import { motion } from "framer-motion";
import {useParams, useRouter} from "next/navigation";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const {websiteId} = useParams()

    const router = useRouter();

    useEffect(() => {

        WebsiteService.getRecursiveWebsite(websiteId as string).then((data) => {
            setWebsite(data);
        }).catch((error) => {
            setPopupTitle("Erreur");
            setPopupContent("Une erreur s'est produite lors de la récupération des données : " + error.message);
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={"h-full w-full flex justify-center items-center overflow-hidden bg-onBackground flex-col gap-6"}>
            <motion.h1
                initial={{ transform: "scale(.5) translateY(100px)", filter: "blur(10px)", opacity: 0 }}
                animate={{ transform: "scale(1) translateY(0px)", filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: .8, ease: "easeOut", delay: 0.5 }}
                className={"text-on-background-hover text-5xl p-3"}>{website?.hero_title}</motion.h1>
            {
                website?.hero_image_url &&
                <motion.img
                    initial={{ transform: "scale(.6)", filter: "blur(10px)", opacity: 0 }}
                    animate={{ transform: "scale(1)", filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={"max-w-[80%] max-h-[80vh] w-fit h-fit rounded-3xl object-contain"}
                    src={website?.hero_image_url}
                    alt="" />

            }

            <motion.button
                onClick={() => {
                    router.push("/" + website?.id + "/" + website?.pages[0].path || "/" + website?.id);
                }}
                initial={{ transform: "scale(.5)", filter: "blur(10px)", opacity: 0 }}
                animate={{ transform: "scale(1)", filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: .5, ease: "easeOut", delay: 1 }}
                className={"border-0 mt-10 rounded-xl bg-primary hover:bg-primaryHover active:bg-primaryHover text-background pb-3 pt-3 pl-5 pr-5 flex gap-4 items-center"}>
                <p className={"font-[600]"}>{website?.pages[0].title || "Commencer à explorer"} </p>
                <img src={"/ico/rocket-solid.svg"} alt={"rocket"} className={"w-5"}/>
            </motion.button>


            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle} closePopup={() => setShowPopup(false)} />

            <LoadingPopup show={loading}/>
        </div>
    );
}
