import {useEffect, useState} from "react";
import SvgFromString from "@/app/components/SvgFromString";

export default function Icon({iconName, size=6, color="text"}: {iconName: string, size?: number, color?:string}) {
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
    },[]);

    return <SvgFromString svg={iconSrc} color={color} className={`w-${size}`}/>
}