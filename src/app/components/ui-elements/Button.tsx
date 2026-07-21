'use client';

import { motion } from "framer-motion";
import { buttonVariants, getHoverTapProps } from "../../transitions/ButtonTransitions";
import { ButtonView, SharedButtonProps } from "@/app/components/ui-elements/ButtonView";
import {globalTransitions} from "@/app/transitions/GlobalTransitions";

export interface ButtonProps extends SharedButtonProps {
    onClickAction?: () => void;
    submit?: boolean;
    layoutId?: string;
}

export default function Button(props: ButtonProps) {
    const { onClickAction, submit, disabled, loading, takeFullWidth, layoutId } = props;
    const isInteractive = !disabled && !loading;

    return (
        <motion.button
            layout
            layoutId={layoutId}
            disabled={!isInteractive}
            onClick={onClickAction}
            type={submit ? "submit" : "button"}
            initial="initial"
            whileInView="whileInView"
            animate="animate"
            exit="exit"
            variants={buttonVariants}
            transition={globalTransitions}
            viewport={{ once: true, amount: 0.1 }}
            {...getHoverTapProps(isInteractive)}
            className={takeFullWidth ? "block w-full" : "inline-block min-w-fit w-fit"}
        >
            <ButtonView {...props} />
        </motion.button>
    );
}