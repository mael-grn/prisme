import {Transition} from "framer-motion";

export const globalTransitions: Transition = {
    type: "tween",
    ease: [0.16, 1, 0.3, 1],
    duration: 0.6,
};

export const globalTransitionsBubble: Transition = {
    type: "spring",
    stiffness: 140,
    damping: 15,
    opacity: { duration: 0.3 }
};