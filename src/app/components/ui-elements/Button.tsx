'use client';

import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import Icon from "@/app/components/ui-elements/Icon";
import {motion} from "framer-motion";
import {useState} from "react";
import {simpleElementVariant} from "@/app/utils/FramerUtil";

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
    neutral,
    primary
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
                                   actionType = ActionTypeEnum.primary,
                                   isForm = false,
                                   isLoading,
                                   isDisabled = false
                               }: ButtonProps) {

    // On définit explicitement les classes pour que Tailwind les détecte
    const colorClasses = {
        [ActionTypeEnum.primary]: {
            base: "bg-primary",
            hover: "bg-primary-hover"
        },
        [ActionTypeEnum.neutral]: {
            base: "bg-background",
            hover: "bg-on-background-hover" // ou une autre variante
        },
        [ActionTypeEnum.safe]: {
            base: "bg-safe",
            hover: "bg-safe-hover"
        },
        [ActionTypeEnum.dangerous]: {
            base: "bg-dangerous",
            hover: "bg-dangerous-hover"
        }
    };

    const currentColors = colorClasses[actionType];

    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 0px 0px var(--foreground)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={simpleElementVariant.hidden}
            whileInView={simpleElementVariant.visible}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            disabled={isDisabled || isLoading}
            type={isForm ? "submit" : "button"}
            // On utilise la classe de base, et on laisse Tailwind gérer le hover nativement
            className={`flex gap-2 cursor-pointer items-center justify-center pt-2 pb-2 pl-4 pr-4 rounded-full transition-colors
                ${currentColors.base} hover:${currentColors.hover} 
                disabled:cursor-default disabled:opacity-50 text-foreground`}
            onClick={onClick}
        >
            {text}
            {isLoading ? <LoadingIcon /> : <Icon iconName={iconName} color={"foreground"} />}
        </motion.button>
    );
}