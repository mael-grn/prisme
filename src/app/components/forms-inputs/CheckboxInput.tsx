'use client';

import { AnimatePresence, motion } from "framer-motion";

export interface SimpleCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export default function BubbleCheckbox(props: SimpleCheckboxProps) {
    return (
        <motion.label
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            whileTap={{ scale: 0.85 }}
            className={`
                relative flex items-center justify-center w-7 h-7 rounded-full cursor-pointer shrink-0
                transition-colors duration-300 border shadow-sm
                ${props.checked ? 'bg-white/20 border-white/40' : 'bg-black/10 border-gray-300/30'}
                ${props.className}
            `}
        >
            <input
                type="checkbox"
                checked={props.checked}
                onChange={() => props.onChange(!props.checked)}
                className="sr-only"
            />

            <AnimatePresence mode="wait">
                {props.checked && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            mass: 1
                        }}
                        className="w-3.5 h-3.5 rounded-full bg-white shadow-md"
                    />
                )}
            </AnimatePresence>
        </motion.label>
    );
}