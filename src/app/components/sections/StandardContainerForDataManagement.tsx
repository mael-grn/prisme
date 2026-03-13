import Button, {ButtonProps} from "@/app/components/ui-elements/Button";
import { motion } from "framer-motion";
import Icon from "@/app/components/ui-elements/Icon";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import Illustration, {IllustrationSizes} from "@/app/components/ui-elements/Illustration";
import {simpleElementVariant} from "@/app/utils/FramerUtil";

export default function StandardContainerForDataManagement({children, title, message, illustrationName, actions, icon, loading=false, flex1=false, className}: { children?: React.ReactNode, message?: string, title?: string, illustrationName?: string, icon?: string, actions?: ButtonProps[], loading?: boolean, flex1?: boolean, className?: string }) {
    return (
        <motion.div
            className={`overflow-y-auto min-w-fit scrollbar-hide max-w-full max-h-full relative flex flex-col gap-4 h-fit w-fit rounded-3xl bg-background border-2 border-on-background ${flex1 ? "flex-1" : ""} ${className}`}
            initial={simpleElementVariant.hidden}
            whileInView={simpleElementVariant.visible}
            exit={simpleElementVariant.hidden}
        >
            <div className={"flex flex-col gap-4 p-4"}>
                <div className={"flex md:flex-row flex-col gap-4 items-center"}>
                    {illustrationName && <Illustration size={IllustrationSizes.SMALL} name={illustrationName} />}
                    <div className={"flex gap-4 flex-col w-full"}>
                        {
                            title &&
                            <div className={"flex gap-3 items-center"}>
                                {
                                    icon && <Icon size={8} iconName={icon} />
                                }
                                <h2 className={"max-w-3/4"}>{title}</h2>
                            </div>
                        }
                        {
                            message && <p>{message}</p>
                        }
                    </div>
                </div>


                { loading ? <LoadingIcon/> : children}

            </div>


            {
                actions &&
                <div className={"flex w-full bg-linear-to-b from-transparent to-background p-4 flex-1 gap-2 sticky bottom-0 right-0 items-end justify-end pl-12"}>
                    {
                        actions && actions.map((action, index) => (
                            <Button
                                key={index}
                                iconName={action.iconName}
                                text={action.text}
                                onClick={action.onClick}
                                actionType={action.actionType}
                                isForm={action.isForm}
                                isLoading={action.isLoading}
                                isDisabled={action.isDisabled || loading}
                            />
                        ))
                    }
                </div>

            }

        </motion.div>
    )
}