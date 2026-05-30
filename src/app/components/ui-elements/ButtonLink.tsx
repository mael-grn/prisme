'use client';

import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import { buttonTransition, buttonVariants, getHoverTapProps } from "@/app/components/ui-elements/ButtonTransitions";
import { ButtonView, SharedButtonProps } from "@/app/components/ui-elements/ButtonView";

export interface ButtonLinkProps extends SharedButtonProps {
    href?: string;
    newTab?: boolean;
}

export default function ButtonLink(props: ButtonLinkProps) {
    const { href, newTab, disabled, loading, className, takeFullWidth } = props;
    const isInteractive = !disabled && !loading && !!href;

    const widthClass = takeFullWidth ? "block w-full" : "inline-block w-fit";

    const motionContent = (
        <motion.div
            initial="initial"
            whileInView="whileInView"
            animate="animate"
            variants={buttonVariants}
            transition={buttonTransition}
            viewport={{ once: true, amount: 0.1 }}
            {...getHoverTapProps(isInteractive)}
            className={widthClass}
        >
            <ButtonView {...props} />
        </motion.div>
    );

    if (!isInteractive) {
        return motionContent;
    }

    return (
        <Link
            href={href as any}
            target={newTab ? "_blank" : undefined}
            className={`${widthClass} ${className || ""}`}
        >
            {motionContent}
        </Link>
    );
}