"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {CSSProperties, useEffect, useState} from "react";
import {ImageUtil} from "@/app/utils/ImageUtil";
import CssUtil from "@/app/utils/CssUtil";
import Button, {ButtonType} from "@/app/components/ui-elements/Button";
import UserService from "@/app/services/UserService";
import {useRouter} from "next/navigation";
import {User} from "@/app/models/User";
import Notification, {NotificationProps} from "@/app/components/overlays/Notification";

export default function Page() {

    const [cssProps, setCssProps] = useState<CSSProperties>()
    const [imageSrc, setImageSrc] = useState<string>("/img/mountain.jpg")
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)

    const [notification, setNotification] = useState<NotificationProps | null>(null);

    const router = useRouter();

    useEffect(() => {

        UserService.getMyUser().then((res) => {
            setUser(res);
            setNotification({
                title: "Welcome back, " + res.first_name + " !",
                description:"Click on the button below to access your dashboard."
            })
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

    return (
        <>
            <Image width={3000} height={2000} src={imageSrc} alt={"background"} className={"fixed top-0 left-0 h-screen object-cover w-full"}/>

            <main style={cssProps} className={"relative flex flex-col gap-6 justify-center w-full h-screen items-center"}>
                <motion.div
                    initial={{ scale: 0.5, y:-100, opacity: 0 }}
                    whileInView={{ scale: 1, y:0, opacity: 1 }}
                    transition={{
                        duration: 1.3, // Un peu plus lent pour apprécier l'effet
                        ease: [0.16, 1, 0.3, 1] // Courbe "easeOutExponential" style Apple
                    }}
                    className={"flex justify-center backdrop-blur items-center rounded-full bg-background/80"}>
                    <Image width={1000} height={1000} src={"/img/icon.png"} alt="icon" className={"w-72"}/>
                </motion.div>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 1.3, // Un peu plus lent pour apprécier l'effet
                        ease: [0.16, 1, 0.3, 1] // Courbe "easeOutExponential" style Apple
                    }}
                    className="w-2/3 h-fit gap-6 p-10 bg-background/80 backdrop-blur rounded-4xl flex flex-col items-center justify-center overflow-hidden">

                   <h1 className={"text-8xl font-bold text-primary"}>Panorama</h1>
                    <p className={"text-center"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>


                </motion.div>

                <div className="flex gap-4 items-center justify-center">
                    <Button iconSrc={"/illustrations/magnifier.png"} text={"Explorer"}/>
                    <Button loading={loading} iconSrc={"/illustrations/rocket.png"} btnType={ButtonType.Primary} text={user ? "Dashboard" : "Commencer"}/>
                </div>
            </main>
            <Notification show={notification != null} onCloseAction={() => setNotification(null)} title={notification?.title || "Erreur dans l'affiche de la notification."} description={notification?.description} iconSrc={notification?.iconSrc}/>
        </>

    );
}