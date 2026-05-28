'use client';

import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface InputProps {
    placeHolder: string;
    onChangeAction: (value: string) => void;
    validatorAction: (value: string) => string | null;
    value: string;
    className?: string;
}

export default function Input({ placeHolder, onChangeAction, validatorAction, value, className = '' }: InputProps) {
    const [error, setError] = useState<string | null>(null);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setError(validatorAction(val));
        onChangeAction(val);
    };

    return (
        <div className="flex flex-col gap-2 w-sm max-w-sm">
            {/* Conteneur animé de l'input (Style Bulle) */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    opacity: { duration: 0.2 }
                }}
                className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    p-4
                    backdrop-blur-xl
                    border
                    transition-colors duration-300
                    shadow-xl shadow-black/10 shadow-inner
                    
                    ${error
                    ? 'bg-dangerous/20 border-dangerous/40'
                    : 'bg-background/60 border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent'
                }
                    ${className}
                `}
            >
                {/* Reflet supérieur style bulle */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/10 to-transparent"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                    }}
                />

                {/* Input HTML brut épuré */}
                <input
                    placeholder={placeHolder}
                    value={value}
                    onChange={onChange}
                    className="relative z-10 w-full bg-transparent outline-none border-none placeholder:text-muted-foreground text-foreground"
                />
            </motion.div>

            {/* Message d'erreur animé */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm text-dangerous px-2"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}