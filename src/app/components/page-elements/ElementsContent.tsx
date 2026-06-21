import {Page} from "@/app/models/Page";
import ElementService from "@/app/services/elementService";
import useSWR from "swr";
import {useTranslations} from "next-intl";
import Container from "@/app/components/page-elements/Container";

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
    } = useSWR(props.page.id+'-elements', elementsFetcher);
    const t = useTranslations('page')

    return elementsLoading ? <>
    </> : !elements || elements.length == 0 ? <>
        <Container className={"w-full"}>
            <img src={"/illustrations/empty.png"} alt="icon" className={"md:w-48 w-24"}/>
            <p className={"w-full text-center"}>{t('noContentForPage')}</p>
        </Container>
    </> : <>
    </>
}