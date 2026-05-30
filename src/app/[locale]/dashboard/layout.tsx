"use client"

import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import {useTranslations} from "next-intl";
import {useUser} from "@/app/context/UserContext";
import {useTheme} from "@/app/context/ThemeContext";
import {usePathname} from "next/navigation";
import Background from "@/app/components/page-elements/Background";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";

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
        <Background/>
        <main style={themeStyles} className={"relative flex flex-col gap-4 p-6 w-full h-screen max-h-screen"}>
            <Container animationType={"glass-reveal"} orientation={"row"} justify={"between"} className={"w-full"}>
                <div className={"flex items-center justify-center gap-2"}>
                    <Image width={50} height={50} src={"/img/icon.png"} alt="icon"/>
                    <h1 className={"md:text-3xl text-xl font-bold"}>{t('dashboardName')}</h1>
                </div>

                <div className={"flex items-center justify-center gap-2"}>
                    <ButtonLink hideTextMobile={true} loading={userLoading} href={"https://azimut.maelg.fr/users/" + user?.id} newTab={true} text={user?.first_name || "My account"} iconSrc={"/illustrations/avatar.png"}/>
                </div>
            </Container>

            <div className={"flex flex-col md:flex-row gap-4 w-full flex-1 min-h-0"}>
                <Container animationType={"glass-reveal"} className={"md:h-full md:w-fit w-full"}>
                    <div className={"flex w-full h-full items-center gap-2 md:flex-col md:justify-start justify-around"}>
                        {
                            menuItems.map((item, i) => (
                                <ButtonLink hideTextMobile={true} text={t(item.text)} href={"/dashboard/" + item.name} takeFullWidth={true} key={item.text} iconSrc={"/illustrations/" + item.icon + ".png"} btnType={(item.name == "" && pathname.endsWith("dashboard")) ||  (item.name != "" && pathname.endsWith(item.name)) ? ButtonType.Primary : ButtonType.Neutral}/>
                            ))
                        }
                    </div>

                </Container>

                <Container animationType={"glass-reveal"} className={"flex-1 overflow-y-auto w-full h-full"}>
                    {children}
                </Container>
            </div>
        </main>
    </>
}