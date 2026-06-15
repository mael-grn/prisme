"use client";

import {useTranslations} from "next-intl";
import Button from "@/app/components/ui-elements/Button";
import WebsiteService from "@/app/services/WebsiteService";
import useSWR, {mutate} from "swr";
import {InsertableWebsite, Website} from "@/app/models/Website";
import Container from "@/app/components/page-elements/Container";
import Image from "next/image";
import {useFormDialog} from "@/app/context/FormContext";
import CreateWebsiteForm from "../../components/forms/CreateWebsiteForm";
import {useDialog} from "@/app/context/DialogContext";
import {useNotification} from "@/app/context/NotificationContext";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import EditWebsiteForm from "@/app/components/forms/EditWebsiteForm";
import {AnimatePresence} from "framer-motion";
import Link from "next/link";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";

const fetcher = async () => await WebsiteService.getMyWebsites();

export default function WebsitesDashboardSubpage() {
    const t = useTranslations('Dashboard-websites');
    const {openForm} = useFormDialog();

    const {data: websites, error, isLoading, mutate} = useSWR('my-websites', fetcher);

    const handleCreateWebsiteClick = () => {
        openForm({
            triggerId: `create-website`,
            title: t('createWebsiteTitle'),
            description: t('createWebsiteDescription'),
            errorMsg: t('createWebsiteError'),
            successMsg: t('createWebsiteSuccess'),
            iconSrc: "/illustrations/domain.png",
            onSubmit: async (data) => {
                console.log(data);
                const result = await WebsiteService.createWebsite(data as InsertableWebsite);
                await mutate();
                return result;
            },
            form: CreateWebsiteForm
        });
    };

    return (
        <div className="flex flex-col gap-4 flex-1 w-full h-fit">
            <div className="flex gap-4 justify-between items-center w-full">
                <h2 className="md:text-2xl text-lg w-fit font-bold">{t("websiteListName")}</h2>
                <Button
                    layoutId={`create-website`}

                    text={t("createWebsiteName")}
                    iconSrc="/illustrations/new.png"
                    btnType={ButtonType.Primary}
                    onClickAction={handleCreateWebsiteClick}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                {isLoading && (
                    <>
                        <WebsiteListItemSkeleton/>
                        <WebsiteListItemSkeleton/>
                        <WebsiteListItemSkeleton/>
                    </>
                )}
                {error && <Container className={"w-full bg-dangerous"}><p>{t('loadingError')}</p></Container>}
                <AnimatePresence>
                    {websites?.map((site) => (
                        <WebsiteListItem website={site} key={site.id}/>
                    ))}
                </AnimatePresence>
            </div>

            <span className={"h-6"}/>
        </div>
    );
}

function WebsiteListItemSkeleton() {
    return (
        <Container orientation="row" justify="between" className="w-full animate-pulse  pointer-events-none">
            <div className="h-6 w-48 bg-foreground/50 rounded-md"/>

            <div className="flex gap-2">
                <div className="w-10 h-10 bg-foreground/50 rounded-xl"/>
                <div className="w-10 h-10 bg-foreground/50 rounded-xl"/>
            </div>
        </Container>
    );
}

function WebsiteListItem({website}: { website: Website }) {

    const {mutate} = useSWR('my-websites', fetcher);

    const t = useTranslations('Dashboard-websites');
    const {showDialog} = useDialog();
    const {showNotification} = useNotification();
    const {openForm} = useFormDialog();

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

    const handleEditWebsiteClick = () => {
        openForm({
            title: t('editWebsiteTitle'),
            description: t('editWebsiteDescription'),
            errorMsg: t('editWebsiteError'),
            successMsg: t('editWebsiteSuccess'),
            iconSrc: "/illustrations/pencil.png",
            initialValue: website,
            onSubmit: async (data) => {
                const result = await WebsiteService.editWebsite(data as Website);
                await mutate();
                return result;
            },
            form: EditWebsiteForm
        });
    };

    return (
        <Container orientation="row" justify="between"
                   className={`w-full bg-secondary`}>

            <h3 className="text-xl font-bold">{website.title}</h3>
            <div className="flex gap-2">
                <ButtonLink href={`/${website.title}`} iconSrc="/illustrations/binoculars.png"/>
                <Button iconSrc="/illustrations/pencil.png" onClickAction={handleEditWebsiteClick}/>
                <Button
                    layoutId={`delete-${website.id}`}
                    iconSrc="/illustrations/bin.png"
                    btnType={ButtonType.Danger}
                    onClickAction={() =>
                        showDialog({
                            triggerId: `delete-${website.id}`,
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