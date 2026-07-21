import {Variants} from "framer-motion";

export const containerVariants: Variants = {
    initial: { scale: 0.5, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 },
    animate: { opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
};