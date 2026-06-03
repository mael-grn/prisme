import {Page} from "@/app/models/Page";
import ElementService from "@/app/services/elementService";
import useSWR from "swr";
import {useTranslations} from "next-intl";
import Container from "@/app/components/page-elements/Container";

export interface ElementsContentProps {
    page: Page
}

export default function ElementsContent(props: ElementsContentProps) {
    const elementsFetcher = async () => await ElementService.getMyElements(props.page.id);
    const { data: elements, error: elementsError, isLoading: elementsLoading, mutate: elementMutate } = useSWR(props.page.id+'-elements', elementsFetcher);
    const t = useTranslations('page')

    return elementsLoading ? <>
    </> : !elements ? <>
        <Container className={"w-full"}>
            <img src={"/illustrations/trex.png"} alt="icon" className={"md:w-48 w-24"}/>
            <p className={"w-full text-center"}>{t('noContentForPage')}</p>
        </Container>
    </> : <>
    </>
}