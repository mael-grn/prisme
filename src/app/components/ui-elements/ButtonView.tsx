'use client';

import { forwardRef } from "react";
import LoadingIcon, { LoadingIconColor } from "@/app/components/ui-elements/LoadingIcon";

export enum ButtonType {
    Primary = "bg-primary/70",
    Secondary = "bg-secondary/70",
    Neutral = "bg-background/60",
    Danger = "bg-dangerous/70",
    Safe = "bg-safe/70",
}

export interface SharedButtonProps {
    text?: string;
    btnType?: ButtonType;
    iconSrc?: string;
    loading?: boolean;
    disabled?: boolean;
    hideTextMobile?: boolean;
    className?: string;
    takeFullWidth?: boolean;
    size?: "small" | "default"; // NOUVEAU PARAMÈTRE
}

export const ButtonView = forwardRef<HTMLDivElement, SharedButtonProps>(({
                                                                             text,
                                                                             hideTextMobile = false,
                                                                             iconSrc,
                                                                             className = "",
                                                                             disabled,
                                                                             loading,
                                                                             takeFullWidth,
                                                                             btnType = ButtonType.Neutral,
                                                                             size = "default" // Valeur par défaut
                                                                         }, ref) => {
    const isIconOnly = iconSrc && !text;
    const isInteractive = !disabled && !loading;

    const radiusClass = isIconOnly ? "rounded-full" : "rounded-full md:rounded-xl";

    // 1. GESTION DU PADDING (s'adapte à la taille et au mobile)
    const paddingClass = isIconOnly
        ? (size === "small" ? "p-1.5" : "p-2")
        : hideTextMobile
            ? (size === "small" ? "p-1.5 md:px-3 md:py-1.5" : "p-1 md:px-5 md:py-2.5")
            : (size === "small" ? "px-3 py-1.5" : "px-5 py-2.5");

    // 2. GESTION DE LA TAILLE DU TEXTE (Corrige le bug sur ordinateur)
    const textSizeClass = size === "small"
        ? "text-xs md:text-sm"
        : "text-sm md:text-lg";

    // 3. GESTION DE LA TAILLE DE L'ICÔNE
    const iconSizeClass = isIconOnly
        ? (size === "small" ? "w-6 h-6" : "w-10 h-10")
        : hideTextMobile
            ? (size === "small" ? "w-6 h-6 md:w-4 md:h-4" : "w-10 h-10 md:w-6 md:h-6")
            : (size === "small" ? "w-4 h-4" : "w-6 h-6");

    // 4. GESTION DE LA TAILLE DU LOADER
    const loadingSize = isIconOnly
        ? (size === "small" ? 24 : 35)
        : (size === "small" ? 16 : 20);

    return (
        <div
            ref={ref}
            className={`
            shrink-0
                relative items-center justify-center gap-2 max-h-fit
                font-bold transition-all
                min-w-fit
                ${takeFullWidth ? "flex w-full" : "inline-flex w-fit"}
                ${!isInteractive ? "cursor-default opacity-50" : "cursor-pointer"} 
                ${paddingClass}
                ${radiusClass} 
                ${btnType} 
                backdrop-blur-xl
                bg-linear-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner
                ${btnType === ButtonType.Neutral ? "text-foreground" : "text-white"}
                ${textSizeClass}
                ${className}
            `}
        >
            {/* REFLET SUPÉRIEUR */}
            <div
                className={`absolute inset-0 pointer-events-none ${radiusClass} bg-linear-to-b from-white/15 to-transparent`}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                }}
            />

            {/* CONTENU */}
            <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <LoadingIcon
                        size={loadingSize}
                        color={LoadingIconColor.light}
                    />
                ) : (
                    iconSrc && (
                        <img
                            src={iconSrc}
                            alt="icon"
                            className={`object-contain ${iconSizeClass} ${iconSrc.endsWith('.svg') && btnType !== ButtonType.Neutral ? 'invert' : ''}`}
                        />
                    )
                )}
                {/* Le texte est géré ici avec hidden si hideTextMobile est true */}
                {text && <span className={hideTextMobile ? "hidden md:inline" : ""}>{text}</span>}
            </div>
        </div>
    );
});

ButtonView.displayName = "ButtonView";