import Button, {ButtonType} from "@/app/components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import Container from "@/app/components/page-elements/Container";

export interface DialogProps {
    title: string;
    iconSrc?: string;
    description?: string;
    show?: boolean;
    onCloseAction?: () => void;
    onValidateAction?: () => void;
    children?: React.ReactNode;
    submitForValidation?: boolean;
}

export default function Dialog({title, iconSrc, description, onCloseAction, onValidateAction, children, show}: DialogProps) {

    return <AnimatePresence>
        {
            show &&
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{
                    duration: 1.3,
                    ease: [0.16, 1, 0.3, 1]
                }}
                className={"fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex justify-center items-center bg-black/60"}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0}}
                    transition={{
                        duration: 1.3,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`z-50 md:max-w-2/3 md:max-h-2/3`}
                >
                    <div>
                        <Container className={"w-full h-full overflow-auto"}>
                            <h2 className="font-bold text-3xl w-full">{title}</h2>
                            {description && <p className="text-sm w-full opacity-90">{description}</p>}
                            {iconSrc && <img src={iconSrc} alt={"icon"} className={"w-12 h-12"}/>}
                            {children}
                            <div className={"w-full flex mt-6 justify-end items-center gap-2"}>
                                {onValidateAction && <Button btnType={ButtonType.Safe} iconSrc={"/ico/check.svg"} onClickAction={onValidateAction} submit={true}/>}
                                <Button  btnType={ButtonType.Danger} iconSrc={"/ico/close.svg"} onClickAction={onCloseAction}/>
                            </div>
                        </Container>
                    </div>


                </motion.div>
            </motion.div>
        }
    </AnimatePresence>
}