import {Element} from "@/app/models/Element"
import ElementService from "@/app/services/elementService";
import useSWR from "swr";
import ElementsContent from "@/app/components/page-elements/ElementsContent";
import {Page} from "@/app/models/Page";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {containerVariants} from "@/app/transitions/ContainerTransitions";
import {globalTransitions} from "@/app/transitions/GlobalTransitions";
import {useIsAdmin} from "@/app/context/IsAdminContext";
import AddElementButton from "@/app/components/page-elements/elements/AddElementButton";

interface SectionContainerProps {
    element: Element
    page: Page
}

export default function SectionContainer(props: SectionContainerProps) {

    const [hover, setHover] = useState<boolean>(false);
    const isAdmin = useIsAdmin()
    const {data: element, mutate: mutateSelf} = useSWR(
        `element-${props.element.id}`,
        () => ElementService.getElement(props.element.id),
        {fallbackData: props.element}
    );

    return <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
                className={"flex relative p-4 flex-col gap-4 w-full"}>
        <AnimatePresence>
            {
                hover && isAdmin && <motion.div

                    className={`
                absolute top-0 left-0 h-full
                w-full
                flex flex-col gap-4 
                p-6
                overflow-hidden
                rounded-3xl
                bg-background/5
                backdrop-blur-xs
                border border-white/10
                shadow-md shadow-black/5
                -z-1
            `}
                    layout
                    initial="initial"
                    whileInView="whileInView"
                    animate="animate"
                    exit="exit"
                    variants={containerVariants}
                    transition={globalTransitions}
                    viewport={{once: true, amount: 0.1}}>


                </motion.div>
            }
        </AnimatePresence>

        <p>kjsdflskdf</p>
        <ElementsContent page={props.page} fatherId={element.id}/>

        <AnimatePresence>
            {
                isAdmin && hover && <AddElementButton element={element}/>
            }
        </AnimatePresence>

    </div>
}