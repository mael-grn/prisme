import { Variants, Transition, TargetAndTransition } from "framer-motion";

// 1. Les variantes d'apparition
export const buttonVariants: Variants = {
    initial: { scale: 0.5, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 },
    animate: { opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },

};

// Interface pour le retour de notre fonction helper
interface HoverTapProps {
    whileHover?: TargetAndTransition;
    whileTap?: TargetAndTransition;
}

// 3. Le helper pour le survol et le clic
export const getHoverTapProps = (isInteractive: boolean): HoverTapProps => {
    if (!isInteractive) return {};

    return {
        whileHover: {
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 25 }
        },
        whileTap: {
            scale: 0.97
        }
    };
};