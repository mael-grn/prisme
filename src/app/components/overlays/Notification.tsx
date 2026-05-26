import Button from "@/app/components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

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
            <motion.div
                // On intègre le x: "-50%" directement dans Framer Motion pour éviter les conflits
                initial={{ opacity: 0, scale: 0, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%" }}
                exit={{ opacity: 0, scale: 0, x: "-50%" }}
                style={{ transformOrigin: "top center" }} // Plus propre de le mettre dans le style inline
                transition={{
                    duration: 1.3,
                    ease: [0.16, 1, 0.3, 1]
                }}
                // Remplacement de left-auto right-auto par left-1/2
                // Ajout de overflow-hidden pour que la barre de progression épouse les arrondis rounded-3xl
                className={`fixed top-5 left-1/2 justify-center md:max-w-1/2 backdrop-blur w-fit h-fit items-center rounded-3xl bg-background/70 p-3 pb-4 flex gap-4 shadow-lg z-50 overflow-hidden ${!iconSrc && "pl-5"}`}
            >
                {iconSrc && <img src={iconSrc} alt={"icon"} className={"w-12 h-12"}/>}
                <div className={"flex flex-col items-center"}>
                    <h2 className="font-bold w-full">{title}</h2>
                    {description && <p className="text-sm w-full opacity-90">{description}</p>}
                </div>
                <Button iconSrc={"/ico/close.svg"} onClickAction={onCloseAction}/>

                {/* Barre de progression en bas */}
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-primary"
                />
            </motion.div>
        }
    </AnimatePresence>
}