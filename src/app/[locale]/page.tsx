"use client";

import Image from "next/image";
import {useState} from "react";
import Button from "@/app/components/ui-elements/Button";
import {useRouter} from "next/navigation";
import Notification, {NotificationProps} from "@/app/components/overlays/Notification";
import Container from "@/app/components/page-elements/Container";
import ButtonLink, {ButtonLinkProps} from "@/app/components/ui-elements/ButtonLink";
import {useTranslations} from "next-intl";
import {useTheme} from "@/app/context/ThemeContext";
import {useUser} from "@/app/context/UserContext";
import Background from "@/app/components/page-elements/Background";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";

export default function Page() {

    const t = useTranslations('Home');

    const { themeImage, themeStyles } = useTheme();
    const { user, userLoading } = useUser();


    const [notification, setNotification] = useState<NotificationProps | null>(null);

    const router = useRouter();

    return (
        <>
            <Background/>
            <main style={themeStyles} className={"relative flex flex-col gap-6 justify-center w-full h-screen items-center"}>
                <Container rounded={"full"} >
                    <Image width={1000} height={1000} src={"/img/icon.png"} alt="icon" className={"md:w-72 w-48"}/>
                </Container>

                <Container className={"md:max-w-2/3 max-w-10/12"}>
                    <h1 className={"md:text-8xl text-4xl font-bold text-primary w-full text-center"}>Panorama</h1>
                    <p className={"text-center md:text-lg text-sm"}>{t('appIntroText')}</p>

                </Container>

                <div className="flex gap-4 items-center justify-center md:flex-row flex-col md:w-fit w-full max-w-10/12">
                    <Button className={" md:w-fit w-full"} iconSrc={"/illustrations/magnifier.png"} text={t('exploreName')}/>
                    <ButtonLink className={" md:w-fit w-full"} href={"/dashboard"} loading={userLoading} iconSrc={"/illustrations/rocket.png"} btnType={ButtonType.Primary} text={user ? t('dashboardName') : t('startName')}/>
                </div>
            </main>
            <Notification show={notification != null} onCloseAction={() => setNotification(null)} title={notification?.title || "Error"} description={notification?.description} iconSrc={notification?.iconSrc}/>
        </>

    );
}