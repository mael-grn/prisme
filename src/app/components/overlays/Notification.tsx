import Button from "@/app/components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Container from "@/app/components/page-elements/Container";

export interface NotificationProps {
    title: string;
    iconSrc?: string;
    description?: string;
    show?: boolean;
    onCloseAction?: () => void;
}

export default function Notification({title, iconSrc, description, onCloseAction, show}: NotificationProps) {

    // Effet pour fermer automatiquement la notification après 5 secondes
    useEffect(() => {
        if (!show || !onCloseAction) return;

        const timer = setTimeout(() => {
            onCloseAction();
        }, 5000); // 5000 ms = 5 secondes

        return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté avant les 5s
    }, [show, onCloseAction]);

    return <AnimatePresence>
        {
            show &&
            <div className={"fixed top-5 z-999 left-5 right-5 md:top-3 md:left-3 md:right-3 flex justify-center items-center"}>
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0}}
                    style={{ transformOrigin: "top center" }}
                    transition={{
                        duration: 1.3,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className={` justify-center md:max-w-1/2 max-w-full rounded-3xl backdrop-blur overflow-hidden h-fit items-center z-50`}
                >
                    <Container>
                        <div className={"flex items-center justify-center gap-4"}>
                            {iconSrc && <img src={iconSrc} alt={"icon"} className={"w-16 min-w-16 min-h-16 h-16"}/>}
                            <div className={"flex flex-col items-center"}>
                                <h2 className="font-bold w-full">{title}</h2>
                                {description && <p className="text-sm w-full opacity-90">{description}</p>}
                            </div>
                            <Button iconSrc={"/ico/close.svg"} onClickAction={onCloseAction}/>

                        </div>


                    </Container>

                    {/* Barre de progression en bas */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-primary"
                    />

                </motion.div>
            </div>

        }
    </AnimatePresence>
}