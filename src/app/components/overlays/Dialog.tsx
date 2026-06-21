import Button from "@/app/components/ui-elements/Button";
import {AnimatePresence, motion} from "framer-motion";
import React from "react";
import Container from "@/app/components/page-elements/Container";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import {useTranslations} from "next-intl";

export interface DialogProps {
    title: string;
    iconSrc?: string;
    description?: string;
    show?: boolean;
    onCloseAction?: () => void;
    onValidateAction?: () => void;
    disableValidate?: boolean;
    children?: React.ReactNode;
    submitForValidation?: boolean;
    triggerId?: string;
}

export default function Dialog(props: DialogProps) {
    const t = useTranslations("Dialog")

    return <AnimatePresence>
        {
            props.show &&
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{
                    duration: 0.2,
                    ease: "linear"
                }}
                className={"fixed z-999 top-0 left-0 right-0 bottom-0 w-full h-screen flex justify-center md:items-center items-end bg-black/60"}
            >
                <Container
                    layoutId={props.triggerId} flatBottomOnMobile={true}
                    className={"z-50 md:min-w-1/3 md:max-w-fit w-full md:max-h-2/3 md:h-fit h-1/2 overflow-auto"}>
                    <div className="flex gap-4 items-center mb-6">
                        {props.iconSrc && <img src={props.iconSrc} alt={"icon"} className={"w-20 h-20"}/>}
                        <div className={"flex justify-center flex-col gap-2"}>
                            <h2 className="font-bold text-3xl w-full">{props.title}</h2>
                            {props.description && <p className="text-sm w-full opacity-90">{props.description}</p>}
                        </div>
                    </div>

                    {props.children}

                    <span className={"flex-1"}/>
                    <div className={"w-full flex mt-6 justify-end items-center gap-2"}>
                        <Button size={"small"} btnType={ButtonType.Danger} iconSrc={"/ico/close.svg"} text={t('close')}
                                onClickAction={props.onCloseAction}/>
                        {props.onValidateAction && <Button size={"small"} text={t('validate')} disabled={props.disableValidate} btnType={ButtonType.Safe}
                                                     iconSrc={"/ico/check.svg"} onClickAction={props.onValidateAction}
                                                     submit={true}/>}
                    </div>
                </Container>
            </motion.div>
        }
    </AnimatePresence>
}