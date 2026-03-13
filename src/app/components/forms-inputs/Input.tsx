'use client';

import Icon from "@/app/components/ui-elements/Icon";
import {AnimatePresence, motion} from "framer-motion";

export default function Input({
                                  iconName,
                                  placeholder,
                                  value,
                                  setValueAction,
                                  type,
                                  validatorAction = () => null,
                              }: {
    iconName?: string,
    placeholder: string,
    value: string,
    setValueAction: (newValue: string) => void,
    validatorAction?: (value: string) => string | null,
    type?: string
}) {

    const isError = validatorAction(value) !== null;

    return (
        <div
            className={`relative flex flex-col gap-1`}
        >
            <input
                className={`p-3 bg-background border-2 border-on-background focus:bg-on-background hover:bg-on-background rounded-xl outline-none target:outline-none w-full h-12 ${isError && "border-red-500"} ${iconName && "pl-10"}`}
                type={type || "text"}
                value={value}
                onChange={(e) => setValueAction(e.target.value)}
                placeholder={placeholder}
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


            {
                iconName && <div className={"absolute top-3 left-3"}>
                <Icon  iconName={iconName} />
                </div>
            }

        </div>

    );
}