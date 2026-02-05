"use client"

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import OrganizedSections from "@/app/components/sections/containers/OrganizedSections";
import {useParams} from "next/navigation";
import {RecursivePage} from "@/app/models/Page";
import LoadingOverlay from "@/app/components/overlays/LoadingOverlay";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";
import WebsiteService from "@/app/services/WebsiteService";
import {simpleElementVariant} from "../../utils/FramerUtil";
import {useRouter} from "next/navigation";
import SvgFromString from "@/app/components/ui-elements/SvgFromString";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";

/**
 * Page qui permet d'afficher une page d'un site, avec ses sections et ses éléments. C'est la page principale du site, celle qui affiche le contenu.
 * @constructor
 */
export default function Page() {

    // States pour gérer le chargement de la page, les données de la page et du site, et les popups d'erreur.
    const [loading, setLoading] = useState(true);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);
    const [page, setPage] = useState<RecursivePage | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    // On récupère l'id du site et le path de la page depuis les paramètres de l'URL, grâce à useParams.
    const {websiteId, path} = useParams()

    const router = useRouter();

    /**
     * On récupère les données de la page et du site depuis la base de données, grâce à l'API. Si une erreur se produit, on affiche un popup d'erreur. Une fois les données récupérées, on les stocke dans les states correspondants, et on arrête le chargement.
     */
    useEffect(() => {
        WebsiteService.getRecursiveWebsite(websiteId as string).then((data) => {
            const page = data.pages.find((p) => p.path.substring(1) === path as string)
            if (!page) {
                router.push("/" + websiteId);
                return;
            }
            setWebsite(data);
            setPage(page);
        }).catch((error) => {
            setPopupTitle("Erreur");
            setPopupContent("Une erreur s'est produite lors de la récupération des données : " + error.message);
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <main className={"pt-24 p-6"}>

            <motion.div
                className={"flex flex-col  justify-center items-center gap-3"}
            >
                {
                    page?.icon_svg &&
                    <SvgFromString svg={page.icon_svg} color={website?.colors.text_color} className={"w-16"}/>
                }
                <motion.h1
                    initial="hidden"
                    whileInView="visible"
                    variants={simpleElementVariant}
                    transition={{ease: "easeOut"}}
                    className={"md:text-center w-full"}>
                    {page?.title}
                </motion.h1>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    variants={simpleElementVariant}
                    transition={{delay: 0.1, ease: "easeOut"}}
                    className={"md:text-center max-w-4xl w-full"}>
                    {page?.description}
                </motion.p>
            </motion.div>

            <OrganizedSections sections={page?.sections || []}/>

            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle}
                           closePopup={() => setShowPopup(false)}/>

            <LoadingOverlay show={loading}/>

        </main>
    )
}