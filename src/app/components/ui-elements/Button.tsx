'use client';

import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import Icon, {IconSize} from "@/app/components/ui-elements/Icon";
import {motion} from "framer-motion";
import {useState} from "react";
import {simpleElementVariant} from "@/app/utils/FramerUtil";

export interface ButtonProps {
    iconName: string;
    text?: string;
    onClick?: () => void;
    actionType?: ActionTypeEnum;
    isForm?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    small?: boolean;
}

export enum ActionTypeEnum {
    dangerous,
    primary,
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
                                   actionType = ActionTypeEnum.primary,
                                   isForm = false,
                                   isLoading,
                                   isDisabled = false,
                                   small = false
                               }: ButtonProps) {

    const colorClasses = {
        [ActionTypeEnum.primary]: {
            base: "bg-primary",
            hover: "bg-primary-hover"
        },
        [ActionTypeEnum.neutral]: {
            base: "bg-on-background",
            hover: "bg-on-background-hover"
        },
        [ActionTypeEnum.dangerous]: {
            base: "bg-dangerous",
            hover: "bg-dangerous-hover"
        }
    };

    const currentColors = colorClasses[actionType];

    return (
        <button
            disabled={isDisabled || isLoading}
            type={isForm ? "submit" : "button"}
            className={`flex gap-1 w-fit text-sm h-fit cursor-pointer items-center justify-center ${small ? "py-1" : "py-2"} ${text ? `rounded-lg ${small ? "px-2" : "px-3"}` : `rounded-full ${small ? "px-1" : "px-2"}`}
                ${currentColors.base} hover:${currentColors.hover} hover:opacity-80
                disabled:cursor-default disabled:opacity-50 text-foreground`}
            onClick={onClick}
        >
            {isLoading ? <LoadingIcon size={15}/> : <Icon iconName={iconName} color={"foreground"} size={small ? IconSize.xs : IconSize.sm}/>}
            {text}
        </button>
    );
}