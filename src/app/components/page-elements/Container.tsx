'use client';

import React, { UIEvent } from 'react';
import { motion, MotionConfig, TargetAndTransition } from 'framer-motion';

export type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type Orientation = "row" | "col";
export type Justify = "between" | "center" | "around" | "start";

export type BubbleAnimationType =
    | 'subtle-pop'
    | 'bubble-grow'
    | 'float-in'
    | 'glass-reveal'
    | 'ease-bottom'
    | 'bubble-top-right'; // Ajout du nouveau type

interface BubbleContainerProps {
    children: React.ReactNode;
    rounded?: RoundedSize;
    className?: string;
    orientation?: Orientation;
    justify?: Justify;
    disableAnimation?: boolean;
    animationType?: BubbleAnimationType;
    flatBottom?: boolean;
    flatBottomOnMobile?: boolean;
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}

interface AnimationPreset {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
}

const ANIMATION_PRESETS: Record<BubbleAnimationType, AnimationPreset> = {
    'subtle-pop': {
        initial: { scale: 0.92, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20, opacity: { duration: 0.15 } }
        }
    },
    'bubble-grow': {
        initial: { scale: 0.6, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 160, damping: 12, opacity: { duration: 0.25 } }
        }
    },
    'float-in': {
        initial: { scale: 0.85, y: 30, opacity: 0 },
        animate: {
            scale: 1,
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 140, damping: 15 }
        }
    },
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
                mass: 0.9,
                opacity: { duration: 0.3 }
            }
        }
    },
    'ease-bottom': {
        initial: { scale: 0.3, opacity: 0, transformOrigin: "bottom" },
        animate: {
            scale: 1,
            opacity: 1,
            transformOrigin: "bottom",
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    },
    // Nouvelle animation : apparition depuis le coin supérieur droit
    'bubble-top-right': {
        initial: { scale: 0.4, opacity: 0, transformOrigin: "top right" },
        animate: {
            scale: 1,
            opacity: 1,
            transformOrigin: "top right",
            transition: {
                type: "spring",
                stiffness: 220,
                damping: 16,
                opacity: { duration: 0.2 }
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
                                            flatBottom = false,
                                            flatBottomOnMobile = false,
                                            onScroll,
                                        }: BubbleContainerProps) {

    const roundedClasses: Record<RoundedSize, string> = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
    };

    const mdRoundedBottomClasses: Record<RoundedSize, string> = {
        none: 'md:rounded-b-none',
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

    const getRoundedClassName = () => {
        if (flatBottom) {
            return `${selectedRounded} rounded-b-none`;
        }
        if (flatBottomOnMobile) {
            return `${selectedRounded} rounded-b-none ${mdRoundedBottom}`;
        }
        return selectedRounded;
    };

    const combinedRoundedClasses = getRoundedClassName();
    const currentAnimation = ANIMATION_PRESETS[animationType];

    return (
        <MotionConfig reducedMotion={disableAnimation ? "always" : "user"}>
            <motion.div
                initial={currentAnimation.initial}
                animate={currentAnimation.animate}
                exit={currentAnimation.initial}
                viewport={{ once: true, amount: 0.1 }}
                onScroll={onScroll}
                className={`
                    relative
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