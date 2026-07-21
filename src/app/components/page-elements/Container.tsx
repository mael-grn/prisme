'use client';

import React, {UIEvent} from 'react';
import {motion, Variants} from 'framer-motion';
import {globalTransitions} from "@/app/transitions/GlobalTransitions";
import {containerVariants} from "@/app/transitions/ContainerTransitions";

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
    flatBottom?: boolean;
    flatBottomOnMobile?: boolean;
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
    variants?: Variants;
}

export default function BubbleContainer(props: BubbleContainerProps) {

    const roundedClasses: Record<RoundedSize, string> = {
        'none': 'rounded-none',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        'full': 'rounded-full',
    };

    const mdRoundedBottomClasses: Record<RoundedSize, string> = {
        'none': 'md:rounded-b-none',
        'sm': 'md:rounded-b-sm',
        'md': 'md:rounded-b-md',
        'lg': 'md:rounded-b-lg',
        'xl': 'md:rounded-b-xl',
        '2xl': 'md:rounded-b-2xl',
        '3xl': 'md:rounded-b-3xl',
        'full': 'md:rounded-b-full',
    };

    const selectedRounded = roundedClasses[props.rounded || '3xl'];
    const mdRoundedBottom = mdRoundedBottomClasses[props.rounded || '3xl'];

    const getRoundedClassName = () => {
        if (props.flatBottom) {
            return `${selectedRounded} rounded-b-none`;
        }
        if (props.flatBottomOnMobile) {
            return `${selectedRounded} rounded-b-none ${mdRoundedBottom}`;
        }
        return selectedRounded;
    };

    const combinedRoundedClasses = getRoundedClassName();

    return (
        <motion.div
            layout
            layoutId={props.layoutId}
            initial="initial"
            whileInView="whileInView"
            animate="animate"
            exit="exit"
            variants={props.variants ? props.variants : containerVariants}
            transition={globalTransitions}
            viewport={{ once: true, amount: 0.1 }}
            onScroll={props.onScroll}
            className={`
                    relative
                    p-6
                    overflow-hidden
                    ${combinedRoundedClasses}
                    
                    bg-background/60
                    backdrop-blur-xl
                    
                    bg-linear-to-br from-white/20 via-white/5 to-transparent
                    
                    border border-white/20
                    
                    shadow-2xl shadow-black/20 shadow-inner
                    
                    ${props.className}
                `}
        >
            <div
                className={`absolute inset-0 pointer-events-none ${combinedRoundedClasses} bg-linear-to-b from-white/15 to-transparent`}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)'
                }}
            />

            <div className={`relative z-10 flex h-full flex-${props.orientation || 'col'} justify-${props.justify} items-center gap-2`}>
                {props.children}
            </div>
        </motion.div>
    );
}