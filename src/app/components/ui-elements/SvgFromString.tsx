// src/app/components/SvgFromString.tsx
    import { motion } from "framer-motion";
    import React from "react";
    import { simpleElementVariant } from "@/app/utils/FramerUtil";
import SvgUtil from "@/app/utils/SvgUtil";

    type Props = {
        svg: string | null | undefined;
        color?: string;
        alt?: string;
        className?: string;
    };

/**
 * Display an SVG icon from a string that contains the SVG data.
 * @param svg
 * @param color
 * @param className
 * @constructor
 */
export default function SvgFromString({ svg, color, className }: Props) {
        if (!svg) return null;

        return (
            <div className={className ? className : `h-4 w-4`} dangerouslySetInnerHTML={{ __html: color ? SvgUtil.changeSvgColor(svg, color) : svg }}>

            </div>
        );
    }