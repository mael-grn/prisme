"use client"

import Notification, {NotificationProps} from "@/app/components/overlays/Notification";
import {CSSProperties, ReactNode, useEffect, useState} from "react";
import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import UserService from "@/app/services/UserService";
import {ImageUtil} from "@/app/utils/ImageUtil";
import CssUtil from "@/app/utils/CssUtil";
import {User} from "@/app/models/User";
import Button, {ButtonType} from "@/app/components/ui-elements/Button";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import DefaultDashboardSubpage from "@/app/components/dashboard-subpages/defaultDashboardSubpage";

interface MenuItem {
    text: string;
    icon: string;
    element: ReactNode;
}

const menuItems = [
    {
        text: "Websites",
        icon: "domain",
        element: <DefaultDashboardSubpage/>,
    },
    {
        text: "Settings",
        icon: "settings",
        element: <DefaultDashboardSubpage/>,
    },
    {
        text: "Account",
        icon: "avatar",
        element: <DefaultDashboardSubpage/>,
    },
    {
        text: "About",
        icon: "question",
        element: <DefaultDashboardSubpage/>,
    }
]

export default function Page() {
    const [cssProps, setCssProps] = useState<CSSProperties>()
    const [imageSrc, setImageSrc] = useState<string>("/img/mountain.jpg")
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)

    const [notification, setNotification] = useState<NotificationProps | null>(null);

    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(menuItems[0])
    useEffect(() => {
        UserService.getMyUser().then((res) => {
            setUser(res);
        }).catch(() => {
            console.log("not logged in");
        }).finally(() => {
            setLoading(false);
        })
        const image : string = ImageUtil.getRandomBackgroundImage()
        setImageSrc(image)
        CssUtil.getCSSPropertiesFromImage(image).then((props) => {
            setCssProps(props)
            const root = document.documentElement;

            Object.entries(props).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    root.style.setProperty(key, value);
                }
            });
        })
    }, []);
    return <>
        <Image width={3000} height={2000} src={imageSrc} alt={"background"} className={"fixed top-0 left-0 h-screen object-cover w-full"}/>

        <main className={"relative flex flex-col gap-4 p-6 w-full h-screen"}>
            <Container orientation={"row"} justify={"between"} className={"w-full"}>
                <div className={"flex items-center justify-center gap-2"}>
                    <Image width={50} height={50} src={"/img/icon.png"} alt="icon"/>
                    <h1 className={"text-3xl font-bold"}>Dashboard</h1>
                </div>

                <div className={"flex items-center justify-center gap-2"}>
                    <ButtonLink loading={loading} href={"https://azimut.maelg.fr/users/" + user?.id} newTab={true} text={user?.first_name || "My account"} iconSrc={"/illustrations/avatar.png"}/>
                </div>
            </Container>

           <div className={"flex items-center gap-4 flex-1"}>
               <Container className={"h-full"}>
                   {
                       menuItems.map((item, i) => (
                           <Button className={"w-full"} key={i} btnType={item.text == selectedMenuItem?.text ? ButtonType.Primary : ButtonType.Neutral} onClickAction={() => setSelectedMenuItem(item)} text={item.text} iconSrc={"/illustrations/" + item.icon + ".png"}/>
                       ))
                   }
               </Container>

               <Container className={"flex-1 h-full"}>
                   {selectedMenuItem.element}
               </Container>
           </div>
        </main>
        <Notification show={notification != null} onCloseAction={() => setNotification(null)} title={notification?.title || "Erreur dans l'affiche de la notification."} description={notification?.description} iconSrc={notification?.iconSrc}/>
    </>
}