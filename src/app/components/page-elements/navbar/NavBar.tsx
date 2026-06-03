import {useUser} from "@/app/context/UserContext";
import {usePathname} from "next/navigation";
import Button from "@/app/components/ui-elements/Button";
import {useTranslations} from "next-intl";
import ButtonLink from "@/app/components/ui-elements/ButtonLink";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ButtonType} from "@/app/components/ui-elements/ButtonView";
import PageService from "@/app/services/pageService";
import useSWR from "swr";
import {useFormDialog} from "@/app/context/FormContext";
import {InsertablePage, Page} from "@/app/models/Page";
import CreatePageForm from "@/app/components/forms/CreatePageForm";
import {useNotification} from "@/app/context/NotificationContext";
import Link from "next/link";
import WebsiteService from "@/app/services/WebsiteService";
import Checkbox from "@/app/components/forms-inputs/CheckboxInput";
import {useDialog} from "@/app/context/DialogContext";

export interface NavBarProps {
    websiteId: number;
    scrolled?: boolean;
}

export default function NavBar(props: NavBarProps) {

    const pathname = usePathname();
    const {user, userLoading} = useUser();
    const {openForm} = useFormDialog();
    const {showDialog} = useDialog();
    const {showNotification} = useNotification();
    const t = useTranslations("page")
    const pageName = (pathname.split('/').length > 3 ? pathname.split('/')[3].replaceAll('%20', ' ') : t('homeName'));

    const [pageEditionMode, setPageEditionMode] = useState<boolean>(false)
    const [pageToEdit, setPageToEdit] = useState<Page[]>([])

    const fetcher = async () => await PageService.getMyPages(props.websiteId);
    const fetchWebsite = async () => await WebsiteService.getWebsite(String(props.websiteId));
    const {data: website, error: websiteError, isLoading: websiteLoading, mutate: mutateWebsite} = useSWR(`website-${props.websiteId}`, fetchWebsite);
    const {data: pages, error, isLoading, mutate} = useSWR('website-pages', fetcher);

    const togglePageEditionMode = () => {
        if (pageEditionMode) {
            setPageToEdit([])
        }
        setPageEditionMode(!pageEditionMode)
    }

    const addOrRemovePageToEditing = (page: Page) => {
        console.log(pageToEdit);
        if (!pageEditionMode) return;
        if (pageToEdit.find((p) => p.id === page.id)) {
            setPageToEdit(pageToEdit.filter((p) => p.id !== page.id));
        } else {
            setPageToEdit([...pageToEdit, page]);
        }
    }

    const onDeleteSelectedPages = () => {
        showDialog({
            title: t('deletePageValidationTitle'),
            description: t('deletePageValidationDesc'),
            iconSrc: '/illustrations/bin.png',
            onValidateAction: async () => {
                try {
                    for (const page of pageToEdit) {
                        await PageService.deletePage(page)
                    }
                    showNotification({
                        title: t('deletePageSuccess'),
                        iconSrc: '/illustrations/check.png',
                    })
                    mutate();
                } catch (e) {
                    showNotification({
                        title: t('deletePageError'),
                        iconSrc: '/illustrations/error.png',
                    })
                }

            }
        })
    }

    return <nav className={"fixed top-0 right-0 w-full z-99 h-[17%] flex justify-center items-center"}>
        <div
            className={`flex gap-4 px-1/12 w-10/12 items-center  justify-between h-full transition-all
            ${props.scrolled ? `` : ""}`}>
            <ButtonLink hideTextMobile={true} iconSrc={"/illustrations/magnifier.png"} /*text={t('searchText')}*//>



            <div className={`flex-1 justify-center flex items-center gap-6 h-full overflow-x-auto`}>
                {
                    !pageEditionMode &&
                    <motion.div key="home" layout className={"shrink-0"}>
                        {(() => {
                            const homeHref = `/${website?.title.replaceAll(' ', '%20')}`;
                            const isHomeActive = pathname.endsWith(homeHref) || pathname.endsWith(`${homeHref}/`);
                            return (
                                <Link className={`relative shrink-0 px-3 py-1.5 z-10 flex items-center`} href={homeHref}>
                                    {t('homeName')}

                                    {!pageEditionMode && isHomeActive && (
                                        <ActiveBackground/>
                                    )}
                                </Link>
                            );
                        })()}
                    </motion.div>
                }
                {
                    pages?.map((page) => {
                        const selected: boolean = !!pageToEdit.find((p) => p.id === page.id);
                        const pageHref = `/${website?.title.replaceAll(' ', '%20')}${pageEditionMode ? "" : page.path == 'root' ? '/' : page.path}`;
                        const isActive = pathname.endsWith(pageHref);
                        return <div key={page.id} className={`flex items-center justify-center gap-1`}>
                            <AnimatePresence>
                                { page.path != 'root' && pageEditionMode && (
                                    <Checkbox
                                        key={1}
                                        onChange={(isChecked) => addOrRemovePageToEditing(page)}
                                        checked={selected}
                                    />
                                )}
                                {
                                    page.path != 'root' &&  <motion.div layout className={"shrink-0"}>
                                        <Link className={`relative shrink-0 px-3 py-1.5 z-10 flex items-center`} href={pageHref}>
                                            {page.title}

                                            {!pageEditionMode && isActive && (
                                                <ActiveBackground/>
                                            )}
                                        </Link>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    })
                }



            </div>

            {
                user && user.id === website?.owner_id &&
                <div className={"flex gap-2"}>
                    <AnimatePresence>
                        {
                            pageEditionMode && <Button key={1} size={"small"} iconSrc={"/ico/trash.svg"} onClickAction={onDeleteSelectedPages} btnType={ButtonType.Danger}/>
                        }
                        <Button
                            key={2}
                            size={"small"}
                            onClickAction={togglePageEditionMode}
                            btnType={pageEditionMode ? ButtonType.Primary : ButtonType.Neutral}
                            iconSrc={"/ico/edit.svg"}/>
                        {
                            !pageEditionMode && <Button
                                key={3}
                                size={"small"}
                                onClickAction={() => openForm<InsertablePage>({
                                    form: CreatePageForm,
                                    initialValue: {title: "", path: "/", website_id: props.websiteId},
                                    title: t('createPageName'),
                                    iconSrc: '/illustrations/wrench.png',
                                    onSubmit: async (p) => {
                                        await PageService.insertPage(p)
                                        mutate();
                                        return p;
                                    },
                                    successMsg: t('createPageSuccess'),
                                    errorMsg: t('createPageError')
                                })}
                                iconSrc={"/ico/add.svg"}/>
                        }
                    </AnimatePresence>
                </div>
            }

            <ButtonLink loading={userLoading} href={'/dashboard'} iconSrc={user ? "/illustrations/binoculars.png" : "/illustrations/avatar.png"}/>

        </div>
    </nav>
}

function ActiveBackground() {
    return <motion.div
        layoutId="active-nav-background"
        className={`backdrop-blur-xl absolute inset-0 -z-10 bg-gradient-to-br from-white/15 via-white/5 to-transparent
                border border-white/20
                shadow-lg shadow-black/10 shadow-inner rounded-full`}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
        <div
            className={`absolute inset-0 pointer-events-none rounded-full bg-gradient-to-b from-white/15 to-transparent`}
            style={{
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
            }}
        />
    </motion.div>
}