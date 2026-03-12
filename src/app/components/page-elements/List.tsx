'use client';


import Button, {ActionTypeEnum, ButtonProps} from "@/app/components/ui-elements/Button";
import Icon from "@/app/components/ui-elements/Icon";
import Illustration, {IllustrationSizes} from "@/app/components/ui-elements/Illustration";
import {AnimatePresence, motion} from "framer-motion";

export interface ListElementProps {
    text: string;
    isImage?: boolean;
    onClick?: () => void;
    actions?: ButtonProps[];
}

function ListElement({props, index, isLast}: { props: ListElementProps, index: number, isLast?: boolean }) {
    return (
        <div className="flex w-full relative items-center">
            <div className={`p-2 w-10 border-r-2 border-on-background h-10 flex justify-center items-center ${!isLast && "border-b-2"}`}>
                <p className={"text-on-foreground text-sm"}>{index+1}</p>

            </div>

            <AnimatePresence>
                {props.actions && props.actions.length > 0 &&
                    <motion.div
                        className={`flex gap-2 items-center h-10 p-2 border-r-2 border-on-background ${!isLast && "border-b-2"}`}
                    >
                        {
                            props.actions.map((action, index) =>
                                <Button
                                    key={index}
                                    iconName={action.iconName}
                                    text={action.text}
                                    onClick={action.onClick}
                                    actionType={action.actionType}
                                    isForm={action.isForm}
                                    isLoading={action.isLoading}
                                    isDisabled={action.isDisabled}
                                    small={true}
                                />
                            )}
                    </motion.div>
                }
            </AnimatePresence>

            <div
                className={`flex w-full p-2 ${props.onClick && "md:hover:bg-on-background h-10 active:bg-on-background active:opacity-70 cursor-pointer"} ${!isLast && "border-b-2 border-on-background"} bg-background`}
                onClick={props.onClick}>

                {
                    props.isImage ?
                        <img src={props.text} alt={"image"} className={"max-h-52 max-w-fit object-contain w-fit rounded-lg"}/> :
                        <p>{props.text}</p>
                }


            </div>


        </div>

    )
}

export default function List({elements, actions, title}: { elements: ListElementProps[], actions?: ButtonProps[], title?: string }) {

    return (
        <div className={"flex flex-col relative gap-3 w-full"}>
            {
                (title || actions) &&
                    <div className={"flex items-center w-full gap-2 flex-wrap"}>
                        {
                            title && <h2>{title}</h2>
                        }
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
                                    isDisabled={action.isDisabled}
                                />
                            ))
                        }
                    </div>
            }
            <div className={"flex flex-col w-full items-end  border-2 border-on-background bg-background overflow-hidden rounded-2xl"}>
                {elements.length === 0 ?
                    <div className={"flex items-center justify-center w-full p-6 flex-col gap-4"}>
                        <Illustration name={"empty"} size={IllustrationSizes.SMALL}/>
                        <h3>Empty for now</h3>
                    </div> :
                    <>
                        {elements.map((element, index) => <ListElement key={index} index={index} props={element} isLast={index+1 == elements.length}/>)}
                    </>
                }
            </div>
            <p className={"italic self-end text-sm text-onBackgroundHover p-2"}>{elements.length} item(s)</p>

        </div>

    );


}
