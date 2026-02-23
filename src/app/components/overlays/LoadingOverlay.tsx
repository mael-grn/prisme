"use client";

import {AnimatePresence, motion} from "framer-motion";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import {useParams} from "next/navigation";

/**
 * un overlay, qui affiche une animation de chargement. Utile pour les actions longues.
 * @param show
 * @constructor
 */
export default function LoadingOverlay({show} : {show: boolean, message?: string}) {


    const {websiteId} = useParams()

    return (
        <AnimatePresence>
            {
                show &&
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background backdrop-blur z-999 gap-6 flex-col"}>
                    <LoadingIcon/>
                    <p>Loading website data...</p>
                </motion.div>
            }

        </AnimatePresence>
    );

}