'use client';

import LoadingIcon from "@/app/components/LoadingIcon";
import Icon from "@/app/components/Icon";
import { motion } from "framer-motion";

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

export default function Button({iconName, text, onClick, actionType = ActionTypeEnum.neutral, isSecondary=false, isForm = false, isLoading, isDisabled = false}:ButtonProps) {

    return (
        <motion.button
            whileHover={{opacity: 0.8}}
            disabled={isDisabled || isLoading}
            type={isForm ? "submit" : "button"}
            className={`flex  gap-2 cursor-pointer items-center justify-center pt-2 pb-2 pl-4 pr-4 ${ actionType === ActionTypeEnum.neutral ? isSecondary ? "bg-background text-foreground border-1 border-foreground" : "bg-onBackground" : actionType === ActionTypeEnum.safe ? "bg-safe" : "bg-dangerous"} rounded-lg disabled:cursor-default disabled:opacity-50 `}
            onClick={onClick}
        >
            <>
                {
                    isLoading ? <LoadingIcon/> : <Icon iconName={iconName} color={"foreground"}/>
                }

                {text}
            </>
        </motion.button>
    );
}