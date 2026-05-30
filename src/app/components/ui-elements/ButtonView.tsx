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
}

export const ButtonView = forwardRef<HTMLDivElement, SharedButtonProps>(({
                                                                             text,
                                                                             hideTextMobile = false,
                                                                             iconSrc,
                                                                             className = "",
                                                                             disabled,
                                                                             loading,
                                                                             takeFullWidth,
                                                                             btnType = ButtonType.Neutral
                                                                         }, ref) => {
    const isIconOnly = iconSrc && !text;
    const isInteractive = !disabled && !loading;

    const radiusClass = isIconOnly ? "rounded-full" : "rounded-full md:rounded-xl";

    const paddingClass = isIconOnly
        ? "p-1"
        : hideTextMobile
            ? "p-1 md:px-5 md:py-2.5"
            : "px-5 py-2.5";

    return (
        <div
            ref={ref}
            className={`
                relative items-center justify-center gap-2 max-h-fit
                font-bold transition-all
                min-w-fit
                ${takeFullWidth ? "flex w-full" : "inline-flex w-fit"}
                ${!isInteractive ? "cursor-default opacity-50" : "cursor-pointer"} 
                ${paddingClass}
                ${radiusClass} 
                ${btnType} 
                backdrop-blur-xl
                bg-gradient-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner
                ${btnType === ButtonType.Neutral ? "text-foreground" : "text-white"}
                ${hideTextMobile ? "text-[0px] md:text-sm" : "text-sm md:text-lg"}
                ${className}
            `}
        >
            {/* REFLET SUPÉRIEUR */}
            <div
                className={`absolute inset-0 pointer-events-none ${radiusClass} bg-gradient-to-b from-white/15 to-transparent`}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                }}
            />

            {/* CONTENU */}
            <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <LoadingIcon
                        size={isIconOnly ? 35 : 20}
                        color={LoadingIconColor.light}
                    />
                ) : (
                    iconSrc && (
                        <img
                            src={iconSrc}
                            alt="icon"
                            className={`object-contain ${
                                isIconOnly
                                    ? "w-10 h-10"
                                    : hideTextMobile
                                        ? "w-10 h-10 md:w-6 md:h-6"
                                        : "w-6 h-6"
                            }`}
                        />
                    )
                )}
                {text && <span className={hideTextMobile ? "hidden md:inline" : ""}>{text}</span>}
            </div>
        </div>
    );
});

ButtonView.displayName = "ButtonView";