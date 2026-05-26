import { motion } from "framer-motion";
import css from "styled-jsx/css";
import LoadingIcon, {LoadingIconColor} from "@/app/components/ui-elements/LoadingIcon";

export enum ButtonType {
    Primary = "bg-primary",
    Secondary = "bg-secondary",
    Neutral = "bg-background",
    Danger = "bg-dangerous",
    Safe = "bg-safe",
}

export interface buttonProps {
    text?: string;
    btnType?: ButtonType;
    iconSrc?: string;
    onClickAction?: () => void;
    loading? :boolean;
    disabled? :boolean;
}

export default function Button({text, iconSrc, disabled, loading, onClickAction, btnType = ButtonType.Neutral}: buttonProps) {
    return (<motion.button
        disabled={disabled || loading}
        onClick={onClickAction}
        initial={{ scale: 0.7, y:50}}
        whileInView={{ scale: 1, y:0}}
        transition={{
            duration: 1.3, // Un peu plus lent pour apprécier l'effet
            ease: [0.16, 1, 0.3, 1] // Courbe "easeOutExponential" style Apple
        }}
        whileHover={!disabled && !loading ? {
            y: -8, // Déplace l'élément de 8 pixels vers le haut
            boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.50)", // Crée une ombre plus profonde et douce
            filter: "brightness(0.8)"
        } : undefined}
        className={`flex gap-2 max-h-fit items-center text-lg font-bold justify-center rounded-xl border-0 ${(disabled || loading) ? "cursor-default opacity-70" : "cursor-pointer"} px-4 py-2 ${iconSrc && !text && "pr-2 pl-2 rounded-full"} ${btnType} ${btnType == ButtonType.Neutral ? "text-foreground" : "text-background"}`}
    >
        {
            loading ? <LoadingIcon size={20} color={LoadingIconColor.light}/> : (iconSrc && <img src={iconSrc}  alt={"icon"} className={"w-8 h-8"}/>)
        }
        {text}
    </motion.button>)
}