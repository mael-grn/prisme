import Button from "@/app/components/ui-elements/Button";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import {useTranslations} from "next-intl";
import {Element} from "@/app/models/Element"

interface AddElementButtonProps {
    element: Element;
}
export default function AddElementButton(props: AddElementButtonProps) {
    const t = useTranslations('element')
    return <Button
        takeFullWidth={true}
        btnType={ButtonType.Neutral}
        iconSrc={"/ico/add.svg"}
        text={t('addElementElementName')}
    />
}