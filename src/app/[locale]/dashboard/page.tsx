"use client";

import {useTranslations} from "next-intl";
import Button from "@/app/components/ui-elements/Button";
import WebsiteService from "@/app/services/WebsiteService";
import useSWR, {mutate} from "swr";
import {InsertableWebsite, Website} from "@/app/models/Website";
import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import {useFormDialog} from "@/app/context/FormContext";
import WebsiteForm from "@/app/components/forms/WebsiteForm";
import {useDialog} from "@/app/context/DialogContext";
import {useNotification} from "@/app/context/NotificationContext";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";

const fetcher = async () => await WebsiteService.getMyWebsites();

export default function WebsitesDashboardSubpage() {
    const t = useTranslations('Dashboard-websites');
    const {openForm} = useFormDialog();

    const {data: websites, error, isLoading, mutate} = useSWR('my-websites', fetcher);

    const handleCreateWebsiteClick = () => {
        openForm({
            title: t('createWebsiteTitle'),
            description: t('createWebsiteDescription'),
            errorMsg: t('createWebsiteError'),
            successMsg: t('createWebsiteSuccess'),
            iconSrc: "/illustrations/domain.png",
            onSubmit: async (data) => {
                const result = await WebsiteService.createWebsite(data as InsertableWebsite);
                await mutate();
                return result;
            },
            form: WebsiteForm
        });
    };

    return (
        <div className="flex flex-col gap-4 flex-1 w-full h-fit">
            <div className="flex gap-4 justify-between items-center w-full">
                <h2 className="md:text-2xl text-lg w-fit font-bold">{t("websiteListName")}</h2>
                <Button
                    text={t("createWebsiteName")}
                    iconSrc="/illustrations/new.png"
                    btnType={ButtonType.Primary}
                    onClickAction={handleCreateWebsiteClick}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                {isLoading && (
                    <>
                        <WebsiteListItemSkeleton />
                        <WebsiteListItemSkeleton />
                        <WebsiteListItemSkeleton />
                    </>
                )}
                {error && <p className="text-red-500">Erreur de chargement.</p>}
                {websites?.map((site) => (
                    <WebsiteListItem website={site} key={site.id}/>
                ))}
            </div>

            <span className={"h-6"}/>
        </div>
    );
}

function WebsiteListItemSkeleton() {
    return (
        <Container orientation="row" justify="between" className="w-full animate-pulse  pointer-events-none">
            <div className="h-6 w-48 bg-foreground/50 rounded-md" />

            <div className="flex gap-2">
                <div className="w-10 h-10 bg-foreground/50 rounded-xl" />
                <div className="w-10 h-10 bg-foreground/50 rounded-xl" />
            </div>
        </Container>
    );
}

function WebsiteListItem({website}: { website: Website }) {

    const {mutate} = useSWR('my-websites', fetcher);

    const t = useTranslations('Dashboard-websites');
    const {showDialog} = useDialog();
    const {showNotification} = useNotification();

    const deleteWebsite = async (id: number) => {
        try {
            await WebsiteService.deleteWebsite(id);
            showNotification({
                title: t("deleteSuccess"),
                iconSrc: "/illustrations/check.png"
            })
            mutate();
        } catch (error) {
            showNotification({
                title: t("deleteError"),
                description: error instanceof Error ? error.message : String(error),
                iconSrc: "/illustrations/error.png"
            })
        }

    }

    return (
        <Container orientation="row" justify="between"
                   className={`w-full cursor-pointer ${!website.image_src && "bg-secondary"}`}>
            {website.image_src &&
                <Image src={website.image_src} alt="background" fill className="object-cover -z-10" sizes="100vw"/>}
            <h3 className="text-xl font-bold">{website.title}</h3>
            <div className="flex gap-2">
                <Button iconSrc="/illustrations/pencil.png"/>
                <Button
                    iconSrc="/illustrations/bin.png"
                    btnType={ButtonType.Danger}
                    onClickAction={() =>
                        showDialog({
                            title: t("deleteValidationTitle"),
                            description: t("deleteValidationDesc"),
                            onValidateAction: () => {
                                deleteWebsite(website.id);
                            },
                            iconSrc: "/illustrations/bin.png"
                        })
                    }

                />
            </div>
        </Container>
    );
}