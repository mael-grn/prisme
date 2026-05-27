"use client"

import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import {ButtonType} from "@/app/components/ui-elements/Button";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import {useTranslations} from "next-intl";
import {useUser} from "@/app/context/UserContext";
import {useTheme} from "@/app/context/ThemeContext";
import {usePathname} from "next/navigation";

interface MenuItem {
    text: string;
    icon: string;
    name: string;
}

const menuItems: MenuItem[] = [
    {
        text: "websitesName",
        icon: "domain",
        name: "",
    },
    {
        text: "settingsName",
        icon: "settings",
        name: "settings",
    },
    {
        text: "accountName",
        icon: "avatar",
        name: "account",
    },
    {
        text: "aboutName",
        icon: "question",
        name: "about",
    }
]

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {

    const t = useTranslations('Dashboard');
    const pathname = usePathname();
    const { user, userLoading } = useUser();
    const { themeImage, themeStyles } = useTheme();

    return <>
        <Image src={themeImage} alt={"background"} fill className={"object-cover -z-10"} sizes="100vw" />
        <main style={themeStyles} className={"relative flex flex-col gap-4 p-6 w-full h-screen"}>
            <Container orientation={"row"} justify={"between"} className={"w-full"}>
                <div className={"flex items-center justify-center gap-2"}>
                    <Image width={50} height={50} src={"/img/icon.png"} alt="icon"/>
                    <h1 className={"text-3xl font-bold"}>{t('dashboardName')}</h1>
                </div>

                <div className={"flex items-center justify-center gap-2"}>
                    <ButtonLink loading={userLoading} href={"https://azimut.maelg.fr/users/" + user?.id} newTab={true} text={user?.first_name || "My account"} iconSrc={"/illustrations/avatar.png"}/>
                </div>
            </Container>

            <div className={"flex items-center gap-4 flex-1"}>
                <Container className={"h-full"}>
                    {
                        menuItems.map((item, i) => (
                            <ButtonLink text={t(item.text)} href={"/dashboard/" + item.name} className={"w-full"} key={item.text} iconSrc={"/illustrations/" + item.icon + ".png"} btnType={(item.name == "" && pathname.endsWith("dashboard")) ||  (item.name != "" && pathname.endsWith(item.name)) ? ButtonType.Primary : ButtonType.Neutral}/>
                        ))
                    }
                </Container>

                <Container className={"flex-1 h-full"}>
                    {children}
                </Container>
            </div>
        </main>
    </>
}