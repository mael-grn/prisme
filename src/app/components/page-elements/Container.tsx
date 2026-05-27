'use client'; // Obligatoire dans Next.js (App Router) pour utiliser Framer Motion

import React from 'react';
import {motion} from 'framer-motion';

export type RoundedSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type Orientation = "row" | "col";
export type Justify = "between" | "center" | "around" | "start"

interface BubbleContainerProps {
    children: React.ReactNode;
    rounded?: RoundedSize;
    className?: string;
    orientation?: Orientation;
    justify?: Justify;
}

export default function BubbleContainer({
                                            children,
                                            rounded = '3xl',
                                            className = '',
                                            orientation = 'col',
                                            justify = 'start',
                                        }: BubbleContainerProps) {

    const roundedClasses: Record<RoundedSize, string> = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
    };

    const selectedRounded = roundedClasses[rounded];

    return (
        <motion.div
            // 1. CORRECTION DU BUG : On sépare bien l'état initial et la cible d'animation
            initial={{scale: 0.6, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            // Le viewport est maintenant configuré sans marge agressive pour éviter le blocage
            viewport={{once: true, amount: 0.1}}
            transition={{
                type: "spring",
                stiffness: 160,
                damping: 14,
                opacity: {duration: 0.25}
            }}

            // 2. Styles CSS de la bulle (sans coupure visuelle)
            className={`
        relative
        w-fit
        p-6
        overflow-hidden
        ${selectedRounded}
        
        /* Transparence et Flou */
        bg-background/60
        backdrop-blur-xl
        
        /* Dégradé de volume diagonal (Lumière) */
        bg-gradient-to-br from-white/20 via-white/5 to-transparent
        
        /* Bordure fine unique */
        border border-white/20
        
        /* Ombres 3D (Portée + Interne) */
        shadow-2xl shadow-black/20 shadow-inner
        
        ${className}
      `}
        >
            {/* 3. Reflet supérieur avec masque progressif CSS */}
            <div
                className={`
          absolute inset-0 pointer-events-none ${selectedRounded}
          bg-gradient-to-b from-white/15 to-transparent
        `}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)'
                }}
            />

            {/* Contenu */}
            <div className={`relative z-10 flex h-full flex-${orientation} justify-${justify} items-center gap-2`}>
                {children}
            </div>
        </motion.div>
    );
}