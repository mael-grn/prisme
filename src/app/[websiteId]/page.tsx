"use client"

import {useEffect, useState} from "react";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";
import LoadingOverlay from "@/app/components/overlays/LoadingOverlay";
import WebsiteService from "@/app/services/WebsiteService";
import {motion} from "framer-motion";
import {useParams, useRouter} from "next/navigation";
import Icon from "@/app/components/ui-elements/Icon";
import Button from "@/app/components/ui-elements/Button";
import {simpleElementVariant} from "@/app/utils/FramerUtil";

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
            setPopupTitle("Couldn't load the website");
            setPopupContent("The server didn't gave the expected answer.");
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={"flex items-center flex-col gap-6 min-h-screen"}>
            {
                !loading && website == null &&
                <div className={"w-full flex items-center justify-center flex-col gap-6"}>
                    <h1
                        className={"text-on-foreground font-black font-array md:text-8xl text-5xl w-full md:w-6xl text-center"}>It
                        seems the page you requested does not exist</h1>
                    <p>Check the website ID you are looking for in the URL. If you think it&apos;s an error, please
                        contact us.</p>
                </div>
            }
            <motion.h1
                initial={simpleElementVariant.hidden}
                whileInView={simpleElementVariant.visible}
                className={"text-on-foreground font-black font-boska md:text-8xl text-5xl w-full md:w-6xl text-center"}>{website?.hero_title}</motion.h1>

            {
                website?.pages[0] && <Button
                    iconName={"arrow-right"}
                    onClick={() => {
                        router.push(website?.title + "/" + website?.pages[0].path || "/");
                    }}
                    text={website?.pages[0].title || "Commencer à explorer"}
                />
            }

            {
                website?.hero_image_url &&
                <motion.img
                    initial={{scale: 0.5, filter: "blur(10px)", borderRadius: 5, opacity: 0,}}
                    animate={{scale: 1, filter: "blur(0px)", borderRadius: 20, opacity: 1}}
                    transition={{duration: .8, ease: "easeOut"}}
                    className={"w-full object-cover"}
                    src={website?.hero_image_url}
                    alt=""/>
            }

            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle}
                           closePopup={() => setShowPopup(false)}/>

            <LoadingOverlay show={loading}/>
        </div>
    );
}
