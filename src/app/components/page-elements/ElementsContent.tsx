import {Page} from "@/app/models/Page";
import ElementService from "@/app/services/elementService";
import useSWR, {mutate} from "swr";
import {useTranslations} from "next-intl";
import Container from "@/app/components/page-elements/Container";
import SectionContainer from "@/app/components/page-elements/elements/SectionContainer";
import Button from "@/app/components/ui-elements/Button";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import {useState} from "react";
import ContainerTypeSelectionDialog from "@/app/components/overlays/ContainerTypeSelectionDialog";
import {ConteneurType} from "@/app/models/Element";
import {useIsAdmin} from "@/app/context/IsAdminContext";
import {useNotification} from "@/app/context/NotificationContext";

export interface ElementsContentProps {
    page: Page
    fatherId?: number
}

export default function ElementsContent(props: ElementsContentProps) {
    const elementsFetcher = async () => {
        if (!props.fatherId) {
            return ElementService.getMyRootElementsWithNoFatherId(props.page.id);
        } else {
            return ElementService.getMyElementsWithFatherId(props.page.id, props.fatherId);
        }
    };
    const {
        data: elements,
        error: elementsError,
        isLoading: elementsLoading,
        mutate: elementMutate
    } = useSWR(`${props.page.id}-elements-${props.fatherId || 'root'}`, elementsFetcher);
    const t = useTranslations('page')
    const isAdmin = useIsAdmin()
    const {showNotification} = useNotification();

    const [addingElementLoading, setAddingElementLoading] = useState<boolean>(false);
    const [addingContainerElement, setAddingContainerElement] = useState<boolean>(false);
    const [ContainerTypeToAdd, setContainerTypeToAdd] = useState<ConteneurType>('section_conteneur');


    return elementsLoading ? <>
        <Container className={"animate-pulse"}>
            <span/>
        </Container>
        <Container className={"animate-pulse"}>
            <span/>
        </Container>
        <Container className={"animate-pulse"}>
            <span/>
        </Container>
    </> : !elements || elements.length == 0 ? <>
        <Container className={"w-full"}>
            <img src={"/illustrations/empty.png"} alt="icon" className={"md:w-48 w-24"}/>
            <p className={"w-full text-center"}>{t('noContentForPage')}</p>
            {
                addingContainerElement &&
                <ContainerTypeSelectionDialog
                    onSelectAction={(value: ConteneurType) => {setContainerTypeToAdd(value)}}
                    selected={ContainerTypeToAdd}
                />
            }
            {
                isAdmin && <div className={"w-full flex gap-4"}>
                    {
                        addingContainerElement &&
                        <Button
                            onClickAction={() => setAddingContainerElement(false)}
                            takeFullWidth={true}
                            text={t('cancelAddElementName')}
                            btnType={ButtonType.Danger}
                            iconSrc={"/ico/close.svg"}
                        />
                    }
                    <Button
                        onClickAction={ async () => {
                            if (addingContainerElement) {
                                setAddingElementLoading(true)
                                try {
                                    await ElementService.insertElement({
                                        page_id: props.page.id,
                                        element_type: ContainerTypeToAdd,
                                        content: ContainerTypeToAdd
                                    })
                                } catch (e) {
                                    showNotification({
                                        title: t('createSectionError'),
                                        iconSrc: '/illustrations/error.png',
                                    })
                                } finally {
                                    setAddingElementLoading(false)
                                }
                                //pageMutate()
                            } else {
                                setAddingContainerElement(true)
                            }
                        }}
                        loading={addingElementLoading}
                        takeFullWidth={true}
                        text={addingContainerElement ? t('valAddElementName') : t('addElementName')}
                        btnType={addingContainerElement ? ButtonType.Safe : ButtonType.Neutral}
                        iconSrc={addingContainerElement ? "/ico/check.svg" : "/ico/add.svg"}
                    />

                </div>
            }
        </Container>
    </> :
        elements.map((e) => {
            switch (e.element_type) {
                case "section_conteneur":
                    return <SectionContainer key={e.id} element={e} page={props.page}/>
            }
        })
}