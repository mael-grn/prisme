import {useTranslations} from "next-intl";
import {ConteneurType} from "@/app/models/Element";
import {motion} from "framer-motion";
import {useState} from "react";

export interface ContainerTypeSelectionDialogProps {
    onSelectAction: (value: ConteneurType) => void;
    triggerId?: string;
    selected: ConteneurType;
}

const tousLesTypesDeConteneurs: ConteneurType[] = ['section_conteneur', 'tuile_conteneur', 'item_conteneur']
export default function ContainerTypeSelectionDialog(props: ContainerTypeSelectionDialogProps) {
    const t = useTranslations("ContainerTypeSelection")
    return <div className={"flex flex-col gap-2 items-center w-full py-4"}>
        <h1 className={"font-bold text-xl"}>{t('title')}</h1>
        <div className={"w-full flex justify-center items-center"}>
            {
                tousLesTypesDeConteneurs.map((c) => {
                    return <div
                        onClick={() => props.onSelectAction(c)}
                        key={c}
                        className={"flex flex-col relative gap-2 w-24 items-center justify-center p-4 cursor-pointer"}>
                        <img src={"/ico/" + c + ".png"} className={"w-10"} alt={""}/>
                        <p className={"text-center"}>{t(c)}</p>
                        {
                            c === props.selected && <ActiveBackground />
                        }
                    </div>
                })
            }
        </div>
    </div>
}

function ActiveBackground() {
    return <motion.div
        layoutId="active-container-selection-background"
        className={`backdrop-blur-xl absolute inset-0 -z-10 bg-linear-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner rounded-xl bg-background/60`}
        transition={{type: "spring", stiffness: 400, damping: 30}}
    >
        <div
            className={`absolute inset-0 pointer-events-none rounded-xl bg-linear-to-b from-white/15 to-transparent`}
            style={{
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
            }}
        />
    </motion.div>
}