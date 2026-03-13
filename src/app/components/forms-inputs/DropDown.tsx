'use client';

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Illustration from "@/app/components/ui-elements/Illustration";
import Icon, {IconSize} from "@/app/components/ui-elements/Icon";

export default function DropDown({
                                     items,
                                     selectedItem,
                                     setSelectedItemAction,
                                 }: {
    items: string[],
    selectedItem: string,
    setSelectedItemAction: (newValue: string) => void,
}) {

    const [showItems, setShowItems] = useState(false);
    return (
        <div className={"relative"}>
            <div
                className={` py-2 px-3 h-10 rounded-xl bg-background w-fit flex items-center justify-between gap-2 cursor-pointer border-2 border-on-background hover:bg-on-background`}
                onMouseUp={() => setShowItems(!showItems)}
            >
                {selectedItem}
                <Icon size={IconSize.sm} iconName={showItems ? "up" : "down"}/>
            </div>
            <AnimatePresence>
                {
                    showItems &&(
                        <motion.ul
                            key={selectedItem}
                            initial={{opacity: 0, transform: "scaleY(0)", transformOrigin: "top"}}
                            animate={{opacity: 1, transform: "scaleY(1)", transformOrigin: "top"}}
                            exit={{opacity: 0, transform: "scaleY(0)", transformOrigin: "top"}}
                            className={"top-12 z-10 left-0 overflow-hidden w-fit rounded-2xl absolute bg-background h-fit flex flex-col border-2 border-on-background"}>
                            {
                                items.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`p-2 cursor-pointer  ${selectedItem === item ? "bg-on-background-hover" : "hover:bg-on-background"}`}
                                        onMouseUp={() => {
                                            setSelectedItemAction(item);
                                            setShowItems(false);
                                        }}
                                    >
                                        {item}
                                    </li>
                                ))
                            }
                        </motion.ul>
                    )
                }
            </AnimatePresence>

        </div>


    );
}