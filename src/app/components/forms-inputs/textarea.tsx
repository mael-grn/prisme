'use client';

import {AnimatePresence, motion} from "framer-motion";

export default function Textarea({value, onChangeAction, placeholder, validatorAction = () => null}: {value: string, onChangeAction: (newValue: string) => void, placeholder?: string, validatorAction?: (value: string) => string | null,}) {

    const isError = validatorAction(value) !== null;

    return (
        <div>
            <textarea
                className={`focus:outline-0 md:hover:bg-on-background ${isError && "border-red-500"} bg-background focus:bg-on-background border-2 border-on-background rounded-xl outline-0 p-2 w-full h-64 min-h-64 max-h-64 resize-none`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChangeAction(e.target.value)}
            />
            <AnimatePresence>
                {
                    isError && <motion.p
                        initial={{opacity: 0, y: -5}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -5}}
                        className={"text-red-500 text-[12px]"}
                    >
                        {validatorAction(value)}
                    </motion.p>
                }
            </AnimatePresence>
        </div>

    )
}