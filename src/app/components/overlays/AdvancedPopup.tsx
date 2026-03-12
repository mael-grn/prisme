import {AnimatePresence, motion} from "framer-motion";
import {ActionTypeEnum, ButtonProps} from "@/app/components/ui-elements/Button";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import {useEffect} from "react";

/**
 * Une popup qui affiche assez simplement un message avec un titre et une icone, mais qui peut aussi afficher des actions et du contenu personnalisé
 * Son affichage est géré par la prop "show", et elle peut être fermée en cliquant sur le bouton "Fermer".
 * @param show
 * @param icon
 * @param title
 * @param message
 * @param closePopup necessaire, mettre la fonction permettant de mettre "show" à false
 * @param actions
 * @param children possibilité d'afficher du contenu personnalisé dans la popup, en dessous du message et au dessus des actions
 * @constructor
 */
export default function AdvancedPopup({show, icon, title, message, closePopup, actions, children} : {show: boolean, icon?: string, message?: string, title: string, closePopup: () => void, actions?: ButtonProps[], children?: React.ReactNode}) {

    const defaultActions: ButtonProps[] = [{iconName: "close", text: "Close", onClick: closePopup, actionType: ActionTypeEnum.neutral}];

    useEffect(() => {
        if (show) {
            // Désactive le scroll sur le body
            document.body.style.overflow = 'hidden';
        } else {
            // Réactive le scroll quand la popup se ferme
            document.body.style.overflow = 'unset';
        }
        // Nettoyage (cleanup) si le composant est démonté brutalement
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    return (
        <AnimatePresence>
            {
                show && <motion.div
                    className={"fixed top-0 p-10 left-0 w-full h-full flex items-center justify-center bg-background-opacity z-999"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <StandardContainerForDataManagement className={"md:min-w-1/2"} title={title} icon={icon} actions={defaultActions.concat(actions || [])} children={children}/>
                </motion.div>
            }
        </AnimatePresence>
    );

}