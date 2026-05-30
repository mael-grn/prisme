'use client';

import React from 'react';
import { motion, MotionConfig, TargetAndTransition } from 'framer-motion';

export type RoundedSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type Orientation = "row" | "col";
export type Justify = "between" | "center" | "around" | "start";

// 1. Mise à jour des types avec les nouvelles animations complexes
export type BubbleAnimationType = 'subtle-pop' | 'bubble-grow' | 'float-in' | 'glass-reveal';

interface BubbleContainerProps {
    children: React.ReactNode;
    rounded?: RoundedSize;
    className?: string;
    orientation?: Orientation;
    justify?: Justify;
    disableAnimation?: boolean;
    animationType?: BubbleAnimationType;
    flatBottomOnMobile?: boolean;
}

// 2. Dictionnaire de configurations d'animations scalables
interface AnimationPreset {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
}

const ANIMATION_PRESETS: Record<BubbleAnimationType, AnimationPreset> = {
    // Très sobre : un pop ultra-rapide et discret
    'subtle-pop': {
        initial: { scale: 0.92, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20, opacity: { duration: 0.15 } }
        }
    },
    // Le concept Bulle de base : la bulle gonfle et se stabilise
    'bubble-grow': {
        initial: { scale: 0.6, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 160, damping: 12, opacity: { duration: 0.25 } }
        }
    },
    // Moderne : la bulle monte légèrement tout en se gonflant
    'float-in': {
        initial: { scale: 0.85, y: 30, opacity: 0 },
        animate: {
            scale: 1,
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 140, damping: 15 }
        }
    },
    // NOUVEAU - Très Complexe : Arrivée en pivot diagonal, redressement et stabilisation
    'glass-reveal': {
        initial: { scale: 0.7, y: 50, x: -30, rotate: -6, opacity: 0 },
        animate: {
            scale: 1,
            y: 0,
            x: 0,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14,
                mass: 0.9, // Réduit la masse pour rendre le mouvement plus aérien
                opacity: { duration: 0.3 }
            }
        }
    }
};

export default function BubbleContainer({
                                            children,
                                            rounded = '3xl',
                                            className = '',
                                            orientation = 'col',
                                            justify = 'start',
                                            disableAnimation = false,
                                            animationType = 'subtle-pop',
                                            flatBottomOnMobile = false,
                                        }: BubbleContainerProps) {

    // Dictionnaire des arrondis globaux
    const roundedClasses: Record<RoundedSize, string> = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
    };

    // Dictionnaire des arrondis pour le bas sur écran moyen/large (pc)
    const mdRoundedBottomClasses: Record<RoundedSize, string> = {
        sm: 'md:rounded-b-sm',
        md: 'md:rounded-b-md',
        lg: 'md:rounded-b-lg',
        xl: 'md:rounded-b-xl',
        '2xl': 'md:rounded-b-2xl',
        '3xl': 'md:rounded-b-3xl',
        full: 'md:rounded-b-full',
    };

    const selectedRounded = roundedClasses[rounded];
    const mdRoundedBottom = mdRoundedBottomClasses[rounded];

    // Combinaison des classes : Arrondi normal + (si actif : casse l'arrondi en bas sur mobile, le remet sur PC)
    const combinedRoundedClasses = `${selectedRounded} ${flatBottomOnMobile ? `rounded-b-none ${mdRoundedBottom}` : ''}`;

    const currentAnimation = ANIMATION_PRESETS[animationType];

    return (
        <MotionConfig reducedMotion={disableAnimation ? "always" : "user"}>
            <motion.div
                initial={currentAnimation.initial}
                animate={currentAnimation.animate}
                exit={currentAnimation.initial}
                viewport={{ once: true, amount: 0.1 }}
                style={{ transformOrigin: "center center" }}
                className={`
                    relative
                    w-fit
                    p-6
                    overflow-hidden
                    ${combinedRoundedClasses}
                    
                    bg-background/60
                    backdrop-blur-xl
                    
                    bg-gradient-to-br from-white/20 via-white/5 to-transparent
                    
                    border border-white/20
                    
                    shadow-2xl shadow-black/20 shadow-inner
                    
                    ${className}
                `}
            >
                <div
                    className={`absolute inset-0 pointer-events-none ${combinedRoundedClasses} bg-gradient-to-b from-white/15 to-transparent`}
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)'
                    }}
                />

                <div className={`relative z-10 flex h-full flex-${orientation} justify-${justify} items-center gap-2`}>
                    {children}
                </div>
            </motion.div>
        </MotionConfig>
    );
}