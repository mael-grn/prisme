"use client";

import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";
import StringUtil from "@/app/utils/StringUtil";
import {HexColorPicker} from "react-colorful";
import Input from "@/app/components/forms-inputs/Input";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";

export default function ColorItem({ colorHexCode, colorName, changeColorAction }: { colorHexCode?: string, colorName?: string, changeColorAction?: (c:string) => void }) {

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState(colorHexCode || "");

    useEffect(() => {
        setNewColor(colorHexCode ?? "");
    }, [colorHexCode]);

    /**
     * check if the popup is out of the screen, and by how much
     */
    const getOverflowOr0 = () => {
        if (typeof window === "undefined") {
            return 0;
        }
        const offset = window.innerWidth - window.screen.width;

        if (offset > 0) {
            return offset;
        } else {
            return 0;
        }
    };

    return (
        <div>
            <div className={`flex w-fit gap-2 item-center p-1 pr-3 border-2 border-on-background rounded-full ${changeColorAction ? 'cursor-pointer border-2 border-on-background bg-background md:hover:bg-on-background active:bg-on-background' : ''}`} onClick={() => changeColorAction && setShowColorPicker(!showColorPicker)} >
                <div style={{backgroundColor: newColor || colorHexCode || "black"}} className={`w-6 min-w-6 h-6 min-h-6 rounded-full flex items-center justify-center`}>
                    {!colorHexCode && <p>?</p>}
                </div>
                <p className={"flex items-center justify-center"}>{colorName || colorHexCode || "No color"}</p>


            </div>
            <AdvancedPopup
                show={showColorPicker && changeColorAction != null}
                title={"Select the new color for " + colorName}
                closePopup={() => {setShowColorPicker(false); setNewColor(colorHexCode || "black")}}
                actions={[
                    {
                        actionType: ActionTypeEnum.primary,
                        iconName: "check",
                        text: "Done",
                        onClick: () => { changeColorAction && changeColorAction(newColor); setShowColorPicker(false); }
                    }
                ]}
            >
                <div className={"w-full flex flex-col justify-center items-center gap-6"}>
                    <HexColorPicker color={newColor} onChange={setNewColor} />
                    <Input validatorAction={StringUtil.hexColorValidator} iconName={"paint"} placeholder={"Couleur au format HEX"} value={newColor} setValueAction={setNewColor}/>

                </div>

            </AdvancedPopup>
        </div>

    )
}