'use client';

import {motion} from "framer-motion";
import LoadingIcon, {LoadingIconColor} from "@/app/components/ui-elements/LoadingIcon";
import {ButtonType} from "@/app/components/ui-elements/Button";
import {Link} from '@/i18n/routing';

export interface buttonLinkProps {
    text?: string;
    btnType?: ButtonType;
    iconSrc?: string;
    href?: string;
    loading?: boolean;
    disabled?: boolean;
    newTab?: boolean;
    className?: string;
}

export default function ButtonLink({
                                       text,
                                       iconSrc,
                                       className,
                                       disabled,
                                       loading,
                                       href,
                                       newTab,
                                       btnType = ButtonType.Neutral
                                   }: buttonLinkProps) {
    const isIconOnly = iconSrc && !text;
    const isInteractive = !disabled && !loading && href;

    // 1. On remplace motion.a par motion.div.
    // Toute la logique visuelle et d'animation reste strictement identique.
    const buttonContent = (
        <motion.div
            initial={{scale: 0.5, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            animate={{opacity: 1}}
            viewport={{once: true, amount: 0.1}}
            transition={{
                type: "spring",
                stiffness: 140,
                damping: 15,
                opacity: {duration: 0.3}
            }}
            whileHover={isInteractive ? {
                scale: 1.03,
                transition: {type: "spring", stiffness: 400, damping: 25}
            } : undefined}
            whileTap={isInteractive ? {scale: 0.97} : undefined}
            className={`
                relative
                flex gap-2 max-h-fit items-center text-lg font-bold justify-center 
                ${!isInteractive ? "cursor-default opacity-50 pointer-events-none" : "cursor-pointer"} 
                px-5 py-2.5
                
                ${isIconOnly ? "rounded-full p-3.5" : "rounded-xl"} 
                
                ${btnType} 
                
                backdrop-blur-xl
                bg-gradient-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner
                
                ${btnType === ButtonType.Neutral ? "text-foreground" : "text-white"}
            `}
        >
            {/* REFLET SUPÉRIEUR */}
            <div
                className={`
                    absolute inset-0 pointer-events-none 
                    ${isIconOnly ? "rounded-full" : "rounded-xl"}
                    bg-gradient-to-b from-white/15 to-transparent
                `}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                }}
            />

            {/* CONTENU */}
            <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <LoadingIcon size={20} color={LoadingIconColor.light}/>
                ) : (
                    iconSrc && <img src={iconSrc} alt="icon" className="w-6 h-6 object-contain"/>
                )}
                {text && <span>{text}</span>}
            </div>
        </motion.div>
    );

    // 2. Si non cliquable, on renvoie juste la div animée
    if (!isInteractive) {
        return buttonContent;
    }

    // 3. Si cliquable, le Link natif (sans attributs legacy) englobe notre composant visuel.
    // L'attribut className="inline-block" assure que le clic épouse parfaitement la forme du bouton.
    return (
        <Link
            href={href as any}
            target={newTab ? "_blank" : undefined}
            className={`inline-block ${className}`}
        >
            {buttonContent}
        </Link>
    );
}