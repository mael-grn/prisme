// src/app/components/SvgFromString.tsx
    import { motion } from "framer-motion";
    import React from "react";
    import { simpleElementVariant } from "@/app/utils/framerUtil";
import SvgUtil from "@/app/utils/svgUtil";

    type Props = {
        svg: string | null | undefined;
        color?: string;
        alt?: string;
        className?: string;
    };

    export default function SvgFromString({ svg, color, alt, className }: Props) {
        if (!svg) return null;

        const base64 = typeof window !== "undefined"
            ? window.btoa(unescape(encodeURIComponent(color ? SvgUtil.changeSvgColor(svg, color) : svg)))
            : Buffer.from(color ? SvgUtil.changeSvgColor(svg, color) : svg, "utf8").toString("base64");

        const src = `data:image/svg+xml;base64,${base64}`;

        return (
            <motion.img
                initial="hidden"
                whileInView="visible"
                variants={simpleElementVariant}
                transition={{ ease: "easeOut" }}
                src={src}
                alt={alt ?? "icon"}
                className={className}
            />
        );
    }