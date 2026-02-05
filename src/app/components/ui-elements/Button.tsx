'use client';

import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import Icon from "@/app/components/ui-elements/Icon";
import {motion} from "framer-motion";

export interface ButtonProps {
    iconName: string;
    text: string;
    onClick?: () => void;
    actionType?: ActionTypeEnum;
    isForm?: boolean;
    isLoading?: boolean;
    isSecondary?: boolean;
    isDisabled?: boolean;
}

export enum ActionTypeEnum {
    dangerous,
    safe,
    neutral
}

/**
 * Un bouton avec une icone, permettant de centraliser le style et le fonctionnement de tous les boutons de l'application
 * @param iconName
 * @param text
 * @param onClick
 * @param actionType
 * @param isSecondary
 * @param isForm
 * @param isLoading
 * @param isDisabled
 * @constructor
 */
export default function Button({
                                   iconName,
                                   text,
                                   onClick,
                                   actionType = ActionTypeEnum.neutral,
                                   isForm = false,
                                   isLoading,
                                   isDisabled = false
                               }: ButtonProps) {

    return (
        <motion.button
            initial={{scale: 1, boxShadow: "0px 0px 20px 0px var(--foreground)"}}
            whileHover={{scale: 1.05, boxShadow: "0px 8px 20px -5px var(--foreground)"}}
            whileTap={{scale: 0.9}}
            transition={{duration: 0.5, ease: "easeInOut"}}
            disabled={isDisabled || isLoading}
            type={isForm ? "submit" : "button"}
            className={`flex gap-2 cursor-pointer items-center justify-center pt-2 pb-2 pl-4 pr-4 rounded-full disabled:cursor-default disabled:opacity-50 
            ${actionType === ActionTypeEnum.neutral ? "bg-background" : actionType === ActionTypeEnum.safe ? "bg-safe" : "bg-dangerous"}`}
            onClick={onClick}
        >
            <>
                {text}
                {
                    isLoading ? <LoadingIcon/> : <Icon iconName={iconName} color={"foreground"}/>
                }
            </>
        </motion.button>
    );
}