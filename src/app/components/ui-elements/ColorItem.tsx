import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";
import StringUtil from "@/app/utils/StringUtil";
import {HexColorPicker} from "react-colorful";
import Input from "@/app/components/forms-inputs/Input";

export default function ColorItem({ colorHexCode, colorName, changeColorAction }: { colorHexCode?: string, colorName?: string, changeColorAction?: (c:string) => void }) {

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState(colorHexCode || "");

    useEffect(() => {
        setNewColor(colorHexCode ?? "");
    }, [colorHexCode]);

    return (
        <div className="relative">
            <div className={`flex w-fit gap-2 item-center p-1 pr-3 border-2 border-on-background rounded-full ${changeColorAction ? 'cursor-pointer border-2 border-on-background bg-background md:hover:bg-on-background active:bg-on-background' : ''}`} onClick={() => changeColorAction && setShowColorPicker(!showColorPicker)} >
                <div style={{backgroundColor: newColor || colorHexCode || "black"}} className={`w-6 min-w-6 h-6 min-h-6 rounded-full flex items-center justify-center`}>
                    {!colorHexCode && <p>?</p>}
                </div>
                <p className={"flex items-center justify-center"}>{colorName || colorHexCode || "No color"}</p>


            </div>
            <AnimatePresence>
                {
                    showColorPicker && changeColorAction &&
                    <motion.div
                        key={"color-picker"}
                        initial={{ opacity: 0, scale: 0, translateY: -20, translateX: 20, transformOrigin: "top left" }}
                        animate={{ opacity: 1, scale: 1, translateY: 0, translateX: 0, transformOrigin: "top left" }}
                        exit={{ opacity: 0, scale: 0, translateY: -20, translateX: 20, transformOrigin: "top left" }}
                        className={"absolute p-4 flex flex-col items-center gap-4 justify-between top-10 left-0 z-10 rounded-2xl bg-background border-2 border-on-background"}
                    >
                        <HexColorPicker color={newColor} onChange={setNewColor} />
                        <Input validatorAction={StringUtil.hexColorValidator} iconName={"paint"} placeholder={"Couleur au format HEX"} value={newColor} setValueAction={setNewColor}/>

                        <div className={"flex justify-end w-full items-center gap-2"}>
                            <Button iconName={"close"} actionType={ActionTypeEnum.neutral} text={"Cancel"} onClick={() => {setShowColorPicker(false); setNewColor(colorHexCode || "black")}}/>
                            <Button actionType={ActionTypeEnum.primary} iconName={"check"} text={"Done"} onClick={() => { changeColorAction(newColor); setShowColorPicker(false); }} />
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </div>

    )
}