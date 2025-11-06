"use client"

import {useEffect, useState} from "react";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";
import AdvancedPopup from "@/app/components/advancedPopup";
import LoadingPopup from "@/app/components/loadingPopup";
import WebsiteService from "@/app/services/websiteService";
import { motion } from "framer-motion";
import {useParams} from "next/navigation";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const {websiteId} = useParams()


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
        <div className={"h-screen w-full flex justify-center items-center overflow-hidden bg-onBackground flex-col gap-6"}>
            <h1 className={"text-on-background-hover text-5xl p-3"}>{website?.hero_title}</h1>
            {
                website?.hero_image_url &&
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={"w-[80%] h-[80vh] rounded-3xl object-cover"}
                    src={website?.hero_image_url}
                    alt="" />

            }



            <AdvancedPopup show={showPopup} message={popupContent} title={popupTitle} closePopup={() => setShowPopup(false)} />

            <LoadingPopup show={loading} message={"Chargement des données, merci de patienter..."} />
        </div>
    );
}
