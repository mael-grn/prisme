"use client"

import { useTranslations } from "next-intl";
import Button, { ButtonType } from "@/app/components/ui-elements/Button";
import WebsiteService from "@/app/services/WebsiteService";
import useSWR from "swr";
import {Website} from "@/app/models/Website";
import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import {useNotification} from "@/app/context/NotificationContext";
import {useEffect} from "react";
import {useDialog} from "@/app/context/DialogContext";

// Fonction qui explique à SWR comment récupérer les données
const fetcher = async () => await WebsiteService.getMyWebsites();

export default function WebsitesDashboardSubpage() {
    const t = useTranslations('Dashboard-websites');
    const { showNotification } = useNotification();
    const { showDialog } = useDialog();
    // SWR gère automatiquement le chargement, les erreurs et la donnée !
    const { data: websites, error, isLoading } = useSWR('my-websites', fetcher);

    useEffect(() => {
        showNotification({
            title: "Site web créé !",
            description: "Votre nouveau site est prêt à être configuré.",
            iconSrc: "/illustrations/success.png"
        });
        showDialog({
            title: "Petite popup"
        })
    }, []);

    return (
        <div className={"flex flex-col gap-4 flex-1 w-full h-full"}>
            <div className={"flex gap-4 justify-between items-center w-full"}>
                <h2 className={"text-2xl font-bold"}>{t("websiteListName")}</h2>
                <Button text={t("createWebsiteName")} iconSrc={"/illustrations/new.png"} btnType={ButtonType.Primary}/>
            </div>

            <div className={"flex flex-col gap-2 mt-4"}>
                {isLoading && <p>Chargement...</p>}
                {error && <p className="text-red-500">Erreur de chargement.</p>}
                {websites?.map((site) => (
                    <WebsiteListItem website={site} key={site.id} />
                ))}
            </div>
        </div>
    );
}

function WebsiteListItem({website}: {website: Website}) {
    return <Container orientation={"row"} justify={"between"} className={`w-full cursor-pointer ${!website.image_src && "bg-secondary"}`}>
        {website.image_src && <Image src={website.image_src} alt={"background"} fill className={"object-cover -z-10"} sizes="100vw" />
        }
        <h3 className={"text-xl font-bold"}>{website.title}</h3>
        <div className={"flex gap-2"}>
            <Button iconSrc={"/illustrations/pencil.png"}/>
            <Button iconSrc={"/illustrations/bin.png"} btnType={ButtonType.Danger}/>
        </div>
    </Container>
}