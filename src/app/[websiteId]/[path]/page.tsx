"use client"

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import OrganizedSections from "@/app/components/organizedSections";
import {useParams} from "next/navigation";
import {RecursivePage} from "@/app/models/Page";
import LoadingPopup from "@/app/components/loadingPopup";
import AdvancedPopup from "@/app/components/advancedPopup";
import WebsiteService from "@/app/services/websiteService";
import {simpleElementVariant} from "../../utils/framerUtil";
import {useRouter} from "next/navigation";
import SvgFromString from "@/app/components/SvgFromString";
import {RecursiveWebsite} from "@/app/models/DisplayWebsite";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [website, setWebsite] = useState<RecursiveWebsite | null>(null);
    const [page, setPage] = useState<RecursivePage | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const {websiteId, path} = useParams()

    const router = useRouter();

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

            <LoadingPopup show={loading}/>

        </main>
    )
}