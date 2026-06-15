'use client';

import React, {UIEvent} from 'react';
import {motion, MotionConfig, TargetAndTransition} from 'framer-motion';

export type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type Orientation = "row" | "col";
export type Justify = "between" | "center" | "around" | "start";

interface BubbleContainerProps {
    children: React.ReactNode;
    layoutId?: string;
    rounded?: RoundedSize;
    className?: string;
    orientation?: Orientation;
    justify?: Justify;
    disableAnimation?: boolean;
    flatBottom?: boolean;
    flatBottomOnMobile?: boolean;
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
}

const defaultAnimate: TargetAndTransition = { opacity: 1, scale: 1 };
const defaultInitial: TargetAndTransition = { opacity: 0, scale: 0.5 };
export default function BubbleContainer({
                                            children,
                                            rounded = '3xl',
                                            className = '',
                                            orientation = 'col',
                                            justify = 'start',
                                            disableAnimation = false,
                                            flatBottom = false,
                                            flatBottomOnMobile = false,
                                            onScroll,
                                            layoutId,
                                            initial = defaultInitial,
                                            animate = defaultAnimate,
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

    return (
        <motion.div
            layout
            layoutId={layoutId}
            transition={{
                type: "spring",
                stiffness: 140,
                damping: 15,
                opacity: { duration: 0.3 }
            }}
            initial={disableAnimation ? undefined : initial}
            animate={disableAnimation ? undefined : animate}

            viewport={{once: true, amount: 0.1}}
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
    );
}