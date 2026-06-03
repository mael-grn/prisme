import useSWR from "swr";
import WebsiteService from "@/app/services/WebsiteService";
import PageService from "@/app/services/pageService";
import Container from "@/app/components/page-elements/Container";
import {useTranslations} from "next-intl";
import ElementService from "@/app/services/elementService";
import ElementsContent from "@/app/components/page-elements/ElementsContent";
import {useIsAdmin} from "@/app/context/IsAdminContext";
import Button from "@/app/components/ui-elements/Button";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import {useNotification} from "@/app/context/NotificationContext";

export interface PageContentProps {
    websiteId: string;
    pagePath: string;
}

export default function PageContent(props: PageContentProps) {
    const pageFetcher = async () => await PageService.getPageFromWebsite(props.websiteId, props.pagePath);
    const {
        data: page,
        error: pageError,
        isLoading: pageLoading,
        mutate: pageMutate
    } = useSWR(props.websiteId + '-page-' + props.pagePath, pageFetcher);
    const websiteFetcher = async () => await WebsiteService.getWebsite(props.websiteId);
    const {
        data: website,
        error: websiteError,
        isLoading: websiteIsLoading,
        mutate: mutateWebsite
    } = useSWR('website-' + props.websiteId, websiteFetcher);

    const t = useTranslations('page')
    const isAdmin = useIsAdmin();

    const {showNotification} = useNotification();

    return <div className={"w-full flex flex-col gap-4"}>
        {
            pageLoading ? <>
                </> :
                !page ?
                    <Container className={"w-full"}>
                        <img src={"/illustrations/trex.png"} alt="icon" className={"md:w-48 w-24"}/>
                        <p className={"w-full text-center mb-6"}>{t('noPage')}</p>
                        {
                            isAdmin && <Button
                                btnType={ButtonType.Primary}
                                text={t('createPageButtonName')}
                                onClickAction={async () => {
                                    if (website) {
                                        try {
                                            await PageService.insertPage({
                                                website_id: website.id,
                                                title: props.pagePath.replaceAll('%20', ' ').replaceAll('/', ''),
                                                path: props.pagePath
                                            })
                                            showNotification({
                                                title: t('createPageSuccess'),
                                                iconSrc: '/illustrations/check.png',
                                            })
                                            pageMutate();
                                        } catch (e) {
                                            showNotification({
                                                title: t('createPageError'),
                                                iconSrc: '/illustrations/error.png',
                                            })
                                        }
                                    }

                                }}
                            />
                        }
                    </Container> :
                    <ElementsContent page={page}/>
        }
    </div>
}