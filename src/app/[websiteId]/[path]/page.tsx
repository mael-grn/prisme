"use client"

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import OrganizedSections from "@/app/components/organizedSections";
import {useParams} from "next/navigation";
import {RecursivePage} from "@/app/models/Page";
import LoadingPopup from "@/app/components/loadingPopup";
import AdvancedPopup from "@/app/components/advancedPopup";
import WebsiteService from "@/app/services/websiteService";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<RecursivePage | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const {websiteId, path} = useParams()

    useEffect(() => {
        WebsiteService.getRecursiveWebsite(websiteId as string).then((data) => {
            setPage(data.pages.find((p) => p.path.substring(1) === path as string) || null);
        }).catch((error) => {
            setPopupTitle("Erreur");
            setPopupContent("Une erreur s'est produite lors de la récupération des données : " + error.message);
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <main>

            <div className={"flex flex-col  justify-start items-start gap-3"}>
                <motion.h1
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{ease: "easeOut", duration: 0.5}}
                    className={"md:text-center w-full"}>
                    {page?.title}
                </motion.h1>
                <motion.p
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{delay: 0.1, ease: "easeOut", duration: 0.5}}
                    className={"md:text-center w-full"}>
                    {page?.description}
                </motion.p>
            </div>

            <OrganizedSections sections={page?.sections || []}/>

            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle}
                           closePopup={() => setShowPopup(false)}/>

            <LoadingPopup show={loading} message={"Chargement des données, merci de patienter..."}/>

        </main>
    )
}