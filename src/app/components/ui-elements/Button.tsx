'use client';

import { motion } from "framer-motion";
import { buttonTransition, buttonVariants, getHoverTapProps } from "@/app/components/ui-elements/ButtonTransitions";
import { ButtonView, SharedButtonProps } from "@/app/components/ui-elements/ButtonView";

export interface ButtonProps extends SharedButtonProps {
    onClickAction?: () => void;
    submit?: boolean;
}

export default function Button(props: ButtonProps) {
    const { onClickAction, submit, disabled, loading, takeFullWidth } = props;
    const isInteractive = !disabled && !loading;

    return (
        <motion.button
            disabled={!isInteractive}
            onClick={onClickAction}
            type={submit ? "submit" : "button"}
            initial="initial"
            whileInView="whileInView"
            animate="animate"
            variants={buttonVariants}
            transition={buttonTransition}
            viewport={{ once: true, amount: 0.1 }}
            {...getHoverTapProps(isInteractive)}
            className={takeFullWidth ? "block w-full" : "inline-block w-fit"}
        >
            <ButtonView {...props} />
        </motion.button>
    );
}