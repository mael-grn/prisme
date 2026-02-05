import {useEffect, useState} from "react";
import SvgFromString from "@/app/components/ui-elements/SvgFromString";

/**
 * Composant permettant d'afficher une icône à partir de son nom. Les icônes sont chargées dynamiquement depuis le dossier public/ico.
 * @param iconName
 * @param size
 * @param color
 * @constructor
 */
export default function Icon({iconName, size=6, color="foreground"}: {iconName: string, size?: number, color?:string}) {
    const [iconSrc, setIconSrc] =  useState<string>("<svg></svg>");

    useEffect(() => {

        async function load() {
            try {
                const res = await fetch("/ico/" + iconName + ".svg")
                if (!res.ok) {
                    setIconSrc("<svg></svg>")
                    return;
                }
                setIconSrc(await res.text())
            } catch (e) {
                console.error(e)
                setIconSrc("<svg></svg>");
            }
        }

        load();
    },[iconName, color]);

    return <SvgFromString svg={iconSrc} color={color}  className={size ? `w-${size} h-${size}` : ""}/>
}