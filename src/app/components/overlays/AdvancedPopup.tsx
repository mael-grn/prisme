import {AnimatePresence, motion} from "framer-motion";
import Button, {ActionTypeEnum, ButtonProps} from "@/app/components/ui-elements/Button";
import Icon from "@/app/components/ui-elements/Icon";

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
export default function AdvancedPopup({show, icon="info", title, message, closePopup, actions, children} : {show: boolean, icon?: string, message: string, title: string, closePopup: () => void, actions?: ButtonProps[], children?: React.ReactNode}) {
    return (
        <AnimatePresence>
            {
                show && <motion.div
                    className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background-opacity backdrop-blur z-999"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className={"bg-on-background rounded-4xl md:w-1/3 w-full max-h-[80vh] overflow-y-auto flex flex-col items-center justify-center gap-4 p-6"}
                        initial={{transform: "scale(0.5)"}}
                        animate={{transform: "scale(1)"}}
                        exit={{transform: "scale(0.5)"}}
                    >
                        <h2 className={"text-center md:text-5xl text-3xl font-array font-bold"}>{title}</h2>
                        <p className={"text-center w-full bg-on-background-hover p-3 rounded-2xl"}>{message}</p>

                        {children}

                        <div className={"flex gap-2 items-center justify-end w-full"}>
                            <Button iconName={"close"} text={"Close"} onClick={closePopup} actionType={ActionTypeEnum.dangerous} />
                            {
                                actions && actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        iconName={action.iconName}
                                        text={action.text}
                                        onClick={action.onClick}
                                        actionType={action.actionType}
                                        isForm={action.isForm}
                                        isLoading={action.isLoading}
                                        isDisabled={action.isDisabled}
                                    />
                                ))
                            }
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );

}