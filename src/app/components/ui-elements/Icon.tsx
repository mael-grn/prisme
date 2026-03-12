'use client';

import {useEffect, useState} from "react";
import SvgFromString from "@/app/components/ui-elements/SvgFromString";

export enum IconSize {
    xs = 3,
    sm = 4,
    md = 6,
    lg = 8,
    xl = 12
}

const sizeMap: Record<number, string> = {
    [IconSize.xs]: "w-3 h-3 min-w-3 max-w-3 min-h-3 max-h-3",
    [IconSize.sm]: "w-4 h-4 min-w-4 max-w-4 min-h-4 max-h-4",
    [IconSize.md]: "w-6 h-6 min-w-6 max-w-6 min-h-6 max-h-6",
    [IconSize.lg]: "w-8 h-8 min-w-8 max-w-8 min-h-8 max-h-8",
    [IconSize.xl]: "w-12 h-12 min-w-12 max-w-12 min-h-12 max-h-12",
};

export default function Icon({iconName, size=IconSize.md, color="foreground"}: {iconName: string, size?: IconSize, color?:string}) {
    const [iconSrc, setIconSrc] = useState<string>("<svg></svg>");

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
    }, [iconName, color]);

    const sizeClasses = sizeMap[size] || sizeMap[IconSize.md];

    return (
        <SvgFromString
            svg={iconSrc}
            color={color}
            className={`${sizeClasses} flex-shrink-0`}
        />
    );
}