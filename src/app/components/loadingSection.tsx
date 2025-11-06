import {AnimatePresence, motion} from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingSection() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [messageVisible, setMessageVisible] = useState(false);

    const messages: string[] = [
        "Juste un petit moment...",
        "Ce sera bientôt prêt...",
        "Préparation des données...",
        "Quelques secondes encore...",
        "Le meilleur pour la fin...",
    ];

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (!messageVisible) {
            timer = setTimeout(() => {
                setMessageVisible(true);
            }, 1500);
        } else {
            timer = setInterval(() => {
                setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [messageVisible]);

    return (
            <motion.div
                initial={{opacity: 0, transform: "scale(.8)"}}
                animate={{opacity: 1, transform: "scale(1)"}}
                exit={{opacity: 0, transform: "scale(0)"}}
                className={"flex flex-col justify-center items-center gap-3 pt-24 pb-44"}
            >
                <img src={"/ico/loader.gif"} alt={"chargement..."} className={"w-11 h-11"}/>
                <AnimatePresence>
                    {
                        messageVisible &&
                        <motion.p
                            key={messageIndex}
                            initial={{opacity: 0, transform: "scale(.6)", transformOrigin: "bottom"}}
                            animate={{opacity: 1, transform: "scale(1)", transformOrigin: "bottom"}}
                            exit={{opacity: 0, transform: "scale(.6)", transformOrigin: "top"}}
                            transition={{duration: 0.5}}
                            className={`text-center h-20 absolute bottom-20 w-full`}
                        >
                            {messages[messageIndex]}
                        </motion.p>
                    }
                </AnimatePresence>


            </motion.div>

    );
}