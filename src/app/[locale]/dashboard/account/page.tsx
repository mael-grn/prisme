import Image from "next/image";
import {useTranslations} from "next-intl";

export default function DefaultDashboardSubpage() {
    const t = useTranslations('Dashboard-default');

    return <div className={"flex flex-col gap-4 items-center flex-1 justify-center w-full h-full"}>
        <Image width={100} height={100} src={"/illustrations/empty.png"} alt="icon"/>
        <h1 className={"font-bold text-3xl"}>{t("unavailableTitle")}</h1>
        <p>{t("unavailableText")}</p>
    </div>
}