"use client"

import {useEffect, useState} from "react";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import AdvancedPopup from "@/app/components/AdvancedPopup";
import LoadingOverlay from "@/app/components/LoadingOverlay";
import WebsiteService from "@/app/services/WebsiteService";
import { motion } from "framer-motion";
import {useParams, useRouter} from "next/navigation";
import Icon from "@/app/components/Icon";

/**
 * Page d'accueil du site, la première qui s'affiche quand on arrive sur le site.
 * On récupère le websiteId (qui peut en réalité aussi être le nom du site, qui est unique) dans l'url pour faire une requete à l'api et récupérer les données du site, qui sont ensuite affichées.
 * @constructor
 */
export default function Home() {

    // States pour gérer le chargement, les données du site, et les popups d'erreur
    const [loading, setLoading] = useState(true);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    // Récupération du websiteId dans l'url
    const {websiteId} = useParams()

    const router = useRouter();

    /**
     * Au chargement de la page, on fait une requete à l'api pour récupérer les données du site, et on les stocke dans le state "website". Si une erreur se produit, on affiche une popup d'erreur avec le message de l'erreur.
     */
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
        <div className={"flex justify-end items-start flex-col gap-6"}>
            <motion.h1
                initial={{ y:100, filter: "blur(10px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: .8, ease: "easeOut", delay: 0.5 }}
                className={"text-on-foreground text-[70px] w-full text-center"}>{website?.hero_title}</motion.h1>

            {
                website?.pages[0] &&
                <motion.button
                    onClick={() => {
                        router.push(website?.title + "/" + website?.pages[0].path || "/");
                    }}
                    initial={{ scale: .5, filter: "blur(10px)", opacity: 0 }}
                    animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: .5, ease: "easeOut", delay: 1 }}
                    className={"border-0 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-hover pb-2 pt-2 pl-5 pr-2 flex gap-4 items-center"}>
                    <p className={"font-[600]"}>{website?.pages[0].title || "Commencer à explorer"} </p>
                    <span
                        className={"p-2 rounded-full bg-text flex items-center justify-center"}
                    >
                        <Icon iconName={"rocket"} color={website?.colors.background_color} />
                    </span>
                </motion.button>
            }

            {
                website?.hero_image_url &&
                <motion.img
                    initial={{ scale: 0.5, filter: "blur(10px)", borderRadius: 5, opacity: 0, }}
                    animate={{ scale: 1, filter: "blur(0px)", borderRadius: 20, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={"w-full object-cover"}
                    src={website?.hero_image_url}
                    alt="" />
            }

            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle} closePopup={() => setShowPopup(false)} />

            <LoadingOverlay show={loading}/>
        </div>
    );
}
