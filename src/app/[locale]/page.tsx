"use client";

import Image from "next/image";
import {useState} from "react";
import Button, {ButtonType} from "@/app/components/ui-elements/Button";
import {useRouter} from "next/navigation";
import Notification, {NotificationProps} from "@/app/components/overlays/Notification";
import Container from "@/app/components/page-elements/Container";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import {useTranslations} from "next-intl";
import {useTheme} from "@/app/context/ThemeContext";
import {useUser} from "@/app/context/UserContext";

export default function Page() {

    const t = useTranslations('Home');

    const { themeImage, themeStyles } = useTheme();
    const { user, userLoading } = useUser();


    const [notification, setNotification] = useState<NotificationProps | null>(null);

    const router = useRouter();

    return (
        <>
            <Image src={themeImage} alt={"background"} fill className={"object-cover -z-10"} sizes="100vw" />
            <main style={themeStyles} className={"relative flex flex-col gap-6 justify-center w-full h-screen items-center"}>
                <Container rounded={"full"} >
                    <Image width={1000} height={1000} src={"/img/icon.png"} alt="icon" className={"w-72"}/>
                </Container>

                <Container className={"md:max-w-2/3"}>
                    <h1 className={"text-8xl font-bold text-primary w-full text-center"}>Panorama</h1>
                    <p className={"text-center"}>{t('appIntroText')}</p>

                </Container>

                <div className="flex gap-4 items-center justify-center">
                    <Button iconSrc={"/illustrations/magnifier.png"} text={t('exploreName')}/>
                    <ButtonLink href={"/dashboard"} loading={userLoading} iconSrc={"/illustrations/rocket.png"} btnType={ButtonType.Primary} text={user ? t('dashboardName') : t('startName')}/>
                </div>
            </main>
            <Notification show={notification != null} onCloseAction={() => setNotification(null)} title={notification?.title || "Error"} description={notification?.description} iconSrc={notification?.iconSrc}/>
        </>

    );
}