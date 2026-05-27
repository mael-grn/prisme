'use client';

import { motion } from "framer-motion";
import LoadingIcon, { LoadingIconColor } from "@/app/components/ui-elements/LoadingIcon";
import {ButtonType} from "@/app/components/ui-elements/Button";

export interface buttonLinkProps {
    text?: string;
    btnType?: ButtonType;
    iconSrc?: string;
    href?: string;
    loading?: boolean;
    disabled?: boolean;
    newTab?: boolean;
}

export default function ButtonLink({ text, iconSrc, disabled, loading, href, newTab, btnType = ButtonType.Neutral }: buttonLinkProps) {
    const isIconOnly = iconSrc && !text;

    return (
        <motion.a
            href={(!disabled && !loading) ? href : undefined}
            target={newTab ? "_blank" : undefined}
            // 1. APPARITION "BULLE" EN VIEWPORT (Avec valeurs de secours)
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            animate={{ opacity: 1 }} // Sécurité pour s'assurer qu'il s'affiche
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                type: "spring",
                stiffness: 140,
                damping: 15,
                opacity: { duration: 0.3 }
            }}

            // 2. SURVOL SUBTIL (Léger gonflement bulle sans distorsion agressive)
            whileHover={!disabled && !loading ? {
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            } : undefined}

            // CLIC SUBTIL
            whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}

            className={`
                relative
                flex gap-2 max-h-fit items-center text-lg font-bold justify-center 
                ${(disabled || loading) ? "cursor-default opacity-50" : "cursor-pointer"} 
                px-5 py-2.5
                
                /* Détermination stricte de la forme */
                ${isIconOnly ? "rounded-full p-3.5" : "rounded-xl"} 
                
                /* Application de la couleur */
                ${btnType} 
                
                /* Effets physiques du conteneur bulle */
                backdrop-blur-xl
                bg-gradient-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner
                
                ${btnType === ButtonType.Neutral ? "text-foreground" : "text-white"}
            `}
        >
            {/* 3. REFLET SUPÉRIEUR NETTOYÉ (Épouse à 100% la forme sans aucune bordure parasite) */}
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

            {/* Contenu */}
            <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <LoadingIcon size={20} color={LoadingIconColor.light} />
                ) : (
                    iconSrc && <img src={iconSrc} alt="icon" className="w-6 h-6 object-contain" />
                )}
                {text && <span>{text}</span>}
            </div>
        </motion.a>
    );
}