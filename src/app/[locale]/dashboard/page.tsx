"use client"

import {useTranslations} from "next-intl";
import Button, {ButtonType} from "@/app/components/ui-elements/Button";
import {useEffect, useState} from "react";
import {Website} from "@/app/models/Website";
import {useUser} from "@/app/context/UserContext";

export default function WebsitesDashboardSubpage() {
    const t = useTranslations('Dashboard-websites');

    const {user} = useUser()
    const [websites, setWebsites] = useState<Website[]>([]);

    useEffect(() => {

    }, []);

    return <div className={"flex flex-col gap-4 flex-1 w-full h-full"}>
        <div className={"flex gap-4 justify-between items-center w-full"}>
            <h2 className={"text-xl font-bold"}>{t("websiteListName")}</h2>
            <Button text={t("createWebsiteName")} iconSrc={"/illustrations/new.png"} btnType={ButtonType.Primary}/>
        </div>

    </div>
}