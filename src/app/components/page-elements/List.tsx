'use client';

import Button, {ActionTypeEnum, ButtonProps} from "@/app/components/ui-elements/Button";
import Icon from "@/app/components/ui-elements/Icon";
import Illustration, {IllustrationSizes} from "@/app/components/ui-elements/Illustration";
import {AnimatePresence, motion} from "framer-motion";

export interface ListElementProps {
    text: string;
    isImage?: boolean;
    tag?: string;
    onClick?: () => void;
    actions?: ButtonProps[];
}

function ListElement({props, index, isLast, hasActions}: { props: ListElementProps, index: number, isLast?: boolean, hasActions: boolean }) {
    const borderClass = isLast ? "" : "border-b-2";

    return (
        <tr>
            <td className={`${borderClass} border-r-2 w-px border-on-background p-2`}>
                <p className={"w-full h-full flex items-center justify-center"}>
                    {index+1}
                </p>
            </td>

            {hasActions &&
                <td className={`${borderClass} border-r-2 w-px border-on-background w-fit`}>
                    <div className={"flex items-center justify-center gap-2 p-2 w-full h-full"}>
                        {props.actions?.map((action, idx) =>
                            <Button
                                key={idx}
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
                    </div>
                </td>
            }

            <td onClick={props.onClick} className={`${borderClass} border-on-background ${props.onClick ? "cursor-pointer hover:bg-on-background" : ""}`}>
                <div className={"flex items-center gap-2 p-2 w-full h-full"}>
                    {props.tag && <p className={"text-sm px-2 py-0.5 rounded-full bg-on-background-hover"}>{props.tag}</p>}
                    {props.isImage ?
                        <img src={props.text} alt={"image"} className={"max-h-52 max-w-fit object-contain w-fit rounded-lg"}/> :
                        <p>{props.text}</p>
                    }
                </div>
            </td>
        </tr>
    )
}

export default function List({elements, actions, title}: { elements: ListElementProps[], actions?: ButtonProps[], title?: string }) {
    const hasActionsColumn = elements.some(element => element.actions && element.actions.length > 0);

    return (
        <div className={"flex flex-col relative gap-3 w-full"}>
            {(title || actions) &&
                <div className={"flex items-center w-full gap-2 flex-wrap"}>
                    {title && <h2>{title}</h2>}
                    {actions?.map((action, index) => (
                        <Button
                            key={index}
                            {...action}
                        />
                    ))}
                </div>
            }
            {elements.length === 0 ?
                <div className={"flex items-center justify-center w-full p-6 flex-col gap-4 border-2 border-on-background bg-background overflow-hidden rounded-2xl"}>
                    <Illustration name={"empty"} size={IllustrationSizes.SMALL}/>
                    <h3>Empty for now</h3>
                </div> :
                <div className={"overflow-hidden border-2 border-on-background rounded-2xl"}>
                    <table className={"w-full border-separate border-spacing-0 bg-background"}>
                        <thead>
                        <tr className={"bg-on-background"}>
                            <th className={"border-b-2 w-px border-r-2 border-on-background p-2"}>#</th>
                            {hasActionsColumn && <th className={"border-b-2 w-px border-r-2 border-on-background p-2"}>Actions</th>}
                            <th className={"border-b-2 border-on-background p-2 text-left"}>Content</th>
                        </tr>
                        </thead>
                        <tbody>
                        {elements.map((element, index) => (
                            <ListElement
                                key={index}
                                index={index}
                                props={element}
                                isLast={index + 1 === elements.length}
                                hasActions={hasActionsColumn}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            }
            <p className={"italic self-end text-sm text-onBackgroundHover p-2"}>{elements.length} item(s)</p>
        </div>
    );
}