"use client"

import Image from "next/image";
import {useTranslations} from "next-intl";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import {useUser} from "@/app/context/UserContext";

export default function DefaultDashboardSubpage() {
    const t = useTranslations('Dashboard-user');
    const { user} = useUser();
    return <div className={"flex flex-col gap-4 items-center flex-1 justify-center w-full h-full"}>
        <Image width={100} height={100} src={"/illustrations/compass.png"} alt="icon"/>
        <h1 className={"font-bold text-3xl"}>{t("title")}</h1>
        <p>{t("text")}</p>
        <ButtonLink href={"https://azimut.maelg.fr/users/" + user?.id} newTab={true} text={t('button')} />
    </div>
}