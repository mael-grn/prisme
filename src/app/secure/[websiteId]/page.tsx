"use client"

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {DisplayWebsite} from "@/app/models/DisplayWebsite";
import {InsertablePage, Page} from "@/app/models/Page";
import {FieldsUtil} from "@/app/utils/fieldsUtil";
import {ImageUtil} from "@/app/utils/ImageUtil";
import {getDefaultColors, InsertableWebsiteColors, WebsiteColors} from "@/app/models/WebsiteColors";
import WebsiteService from "@/app/services/WebsiteService";
import PageService from "@/app/services/pageService";
import StringUtil from "@/app/utils/StringUtil";
import MainPageWrapper from "@/app/components/page-elements/MainPageWrapper";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import List from "@/app/components/page-elements/List";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";
import ColorItem from "@/app/components/ui-elements/ColorItem";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";
import Form from "@/app/components/forms-inputs/form";
import Input from "@/app/components/forms-inputs/Input";
import Textarea from "@/app/components/forms-inputs/textarea";
import ImageInput from "@/app/components/forms-inputs/imageInput";
import ColorUtil from "@/app/utils/ColorUtil";
import Illustration from "@/app/components/ui-elements/Illustration";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import {AnimatePresence, motion} from "framer-motion";

export default function Pages() {

    const [pages, setPages] = useState<Page[]>([]);
    const [website, setWebsite] = useState<DisplayWebsite | null>(null);
    const [colors, setColors] = useState<WebsiteColors | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [pagesLoading, setPagesLoading] = useState<boolean>(true);
    const [addPageLoading, setAddPageLoading] = useState<boolean>(false);
    const [titleLoading, setTitleLoading] = useState<boolean>(false);
    const [domainLoading, setDomainLoading] = useState<boolean>(false);
    const [heroLoading, setHeroLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [colorsLoading, setColorsLoading] = useState<boolean>(true);

    const [showPopupForm, setShowPopupForm] = useState<boolean>(false);

    const [showPopupDelete, setShowPopupDelete] = useState<boolean>(false);

    const [showPopupEditTitle, setShowPopupEditTitle] = useState<boolean>(false);

    const [showPopupEditDomain, setShowPopupEditDomain] = useState<boolean>(false);

    const [showPopupEditHero, setShowPopupEditHero] = useState<boolean>(false);

    const [showPopupEditColors, setShowPopupEditColors] = useState<boolean>(false);


    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [popupTitle, setPopupTitle] = useState<string>('');

    const [newPageTitle, setNewPageTitle] = useState<string>('');
    const [newPagePath, setNewPagePath] = useState<string>('');
    const [newPageIcon, setNewPageIcon] = useState<string>('');
    const [newPageDescription, setNewPageDescription] = useState<string>('');
    const [newWebsiteTitle, setNewWebsiteTitle] = useState<string>('');

    const [newWebsiteDomain, setNewWebsiteDomain] = useState<string | null>(null);

    const [newWebsiteHeroTitle, setNewWebsiteHeroTitle] = useState<string>('');
    const [newWebsiteHeroFile, setNewWebsiteHeroFile] = useState<File | null>(null);

    const [newColors, setNewColors] = useState<InsertableWebsiteColors | null>(null);

    const [modifyPageOrder, setModifyPageOrder] = useState<boolean>(false);
    const [modifiedPages, setModifiedPages] = useState<number[]>([]);

    const router = useRouter();
    const {websiteId} = useParams();


    useEffect(() => {
        WebsiteService.getWebsiteById(parseInt(websiteId as string))
            .then((website) => {
                setWebsite(website)
                setNewWebsiteDomain(website.website_domain || null)
                setNewWebsiteTitle(website.title)
                setNewWebsiteHeroTitle(website.hero_title)
            }).catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(e);
            setShowPopup(true);
        }).finally(() => setLoading(false));

        WebsiteService.getColors(parseInt(websiteId as string))
            .then((c) => {
                setColors(c);
                setNewColors(c)
            })
            .catch((e) => {
                console.log(e);
                setColors(null);
                setNewColors(() => getDefaultColors(parseInt(websiteId as string)));
            }).finally(() => setColorsLoading(false));

        PageService.getMyPagesFromWebsite(parseInt(websiteId as string))
            .then((p) => setPages(p))
            .catch((e) => {
                setPopupTitle("Something went wrong");
                setPopupText(e);
                setShowPopup(true);
            }).finally(() => setPagesLoading(false));
    }, [websiteId]);

    async function deleteWebsiteAction() {
        setShowPopupDelete(false);

        setDeleteLoading(true);

        try {
            await WebsiteService.deleteWebsite(parseInt(websiteId as string))
            router.push("/secure");
        } catch (e) {
            setPopupTitle("Something went wrong");
            setPopupText(String(e));
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    }

    async function addPageAction() {

        setShowPopupForm(false);

        const newPage: InsertablePage = {
            title: newPageTitle,
            website_id: website!.id,
            path: newPagePath,
        }

        const validation = FieldsUtil.checkPage(newPage)
        if (!validation.valid) {
            setShowPopup(true)
            setPopupTitle("Page information are not valid");
            setPopupText(validation.errors.join(", "));
            return;
        }

        setAddPageLoading(true);

        try {
            await PageService.insertPage(newPage)
            setLoading(false);
            setPages(await PageService.getMyPagesFromWebsite(parseInt(websiteId as string)))
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(String(error));
            setShowPopup(true);
        } finally {
            setAddPageLoading(false);
        }

    }

    const editTitleAction = async () => {
        setShowPopupEditTitle(false);
        if (!newWebsiteTitle || newWebsiteTitle.length === 0) return;
        setTitleLoading(true);

        try {
            const newWebsite: DisplayWebsite = {...website!, title: newWebsiteTitle};
            await WebsiteService.updateWebsite(newWebsite)
            setWebsite(await WebsiteService.getWebsiteById(parseInt(websiteId as string)));
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(String(error));
            setShowPopup(true);
        } finally {
            setTitleLoading(false);
        }
    }

    const editDomainAction = async () => {
        setShowPopupEditDomain(false);
        if (newWebsiteDomain && StringUtil.domainValidator(newWebsiteDomain)) {
            setShowPopup(true);
            setPopupTitle("Invalid domain");
            setPopupText("Please enter a valid domain.");
            return;
        }
        setDomainLoading(true);

        try {
            const newWebsite: DisplayWebsite = {...website!, website_domain: newWebsiteDomain || undefined};
            await WebsiteService.updateWebsite(newWebsite)
            setWebsite(await WebsiteService.getWebsiteById(parseInt(websiteId as string)));
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(String(error));
            setShowPopup(true);
        } finally {
            setDomainLoading(false);
        }
    }

    const editHeroAction = async () => {
        setShowPopupEditHero(false);

        if (!newWebsiteHeroTitle || newWebsiteHeroTitle.length === 0) {
            setShowPopup(true);
            setPopupTitle("Missing information");
            setPopupText("Please provide a title for the homepage.");
            return;
        }

        const newWebsite: DisplayWebsite = {...website!, hero_title: newWebsiteHeroTitle};

        setHeroLoading(true);

        if (newWebsiteHeroFile) {
            newWebsite.hero_image_url = await ImageUtil.uploadImage(newWebsiteHeroFile)
        }

        const validation = FieldsUtil.checkDisplayWebsite(newWebsite)
        if (!validation.valid) {
            setShowPopup(true)
            setPopupTitle("The landing page information are not valid");
            setPopupText(validation.errors.join(", "));
            setLoading(false);
            return;
        }


        try {
            await WebsiteService.updateWebsite(newWebsite)
            setWebsite(await WebsiteService.getWebsiteById(parseInt(websiteId as string)));
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(String(error));
            setShowPopup(true);
        } finally {
            setHeroLoading(false);
        }
    }

    async function editOrInsertWebsiteColorsAction() {
        if (!newColors) {
            setShowPopup(true)
            setPopupTitle("Invalid colors");
            setPopupText("Specified colors are invalid.");
            return;
        }
        const validation = FieldsUtil.checkWebsiteColors(newColors)
        if (!validation.valid) {
            setShowPopup(true)
            setPopupTitle("Specified colors are not valid");
            setPopupText(validation.errors.join(", "));
            return;
        }

        setColorsLoading(true);

        newColors.website_id = parseInt(websiteId as string);

        try {
            if (colors) {
                await WebsiteService.updateColors(website!.id, newColors);
            } else {
                await WebsiteService.insertColors(website!.id, newColors);
            }
            const updatedColors = await WebsiteService.getColors(parseInt(websiteId as string));
            setColors(updatedColors);
            setNewColors(updatedColors);
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(String(error));
            setShowPopup(true);
        } finally {
            setColorsLoading(false);
        }
    }

    function beginModifyPageOrder() {
        setModifyPageOrder(true);
    }

    async function cancelModifyPageOrder() {
        setModifyPageOrder(false);

        setPagesLoading(true)
        setPages(await PageService.getMyPagesFromWebsite(parseInt(websiteId as string)));
        setPagesLoading(false);
    }

    function validateModifyPageOrder() {
        setPagesLoading(true)

        async function loadData() {
            if (!pages) {
                return;
            }
            for (const page of pages) {
                if (modifiedPages && modifiedPages.includes(page.id)) {
                    try {
                        await PageService.movePage(page);
                    } catch (e) {
                        setPages(await PageService.getMyPagesFromWebsite(parseInt(websiteId as string)));
                        setPagesLoading(false);
                        setPopupTitle("Something went wrong");
                        setPopupText(String(e));
                        setShowPopup(true);
                        break;
                    }

                }
            }
            setPages(await PageService.getMyPagesFromWebsite(parseInt(websiteId as string)));
            setPagesLoading(false);
        }

        loadData();
        setModifyPageOrder(false);
    }

    function movePageUp(page: Page) {
        if (!pages) {
            return;
        }
        const newPages: Page[] = [...pages];
        if (page.position === 1) {
            return;
        }

        const modSect: number[] = [...modifiedPages];
        modSect?.push(newPages.find(s => s.position === page.position - 1)!.id);
        modSect?.push(page.id);
        setModifiedPages(modSect)

        newPages.find(s => s.position === page.position - 1)!.position++;
        newPages.find(s => s.id === page.id)!.position--;
        newPages.sort((a, b) => a.position - b.position);
        setPages(newPages);
    }

    function movePageDown(page: Page) {
        if (!pages) {
            return;
        }
        const newPages: Page[] = [...pages];
        if (page.position === pages.length) {
            return;
        }

        const modSect: number[] = [...modifiedPages];
        modSect?.push(newPages.find(s => s.position === page.position + 1)!.id);
        modSect?.push(page.id);
        setModifiedPages(modSect)

        newPages.find(s => s.position === page.position + 1)!.position--;
        newPages.find(s => s.id === page.id)!.position++;
        newPages.sort((a, b) => a.position - b.position);
        setPages(newPages);
    }

    return (
        <>

            <MainPageWrapper loading={loading}>

                {
                    website && website.hero_image_url && <img src={website.hero_image_url} alt={"hero image"}
                                                              className={"fixed top-0 left-0 bottom-0 right-0 w-full h-screen object-cover select-none z-0"}/>
                }

                <Button iconName={"arrow-back"} text={"Back to all websites"} actionType={ActionTypeEnum.neutral}
                        onClick={() => router.push("/secure")}/>

                <div className={"flex justify-center w-full relative gap-4 items-center flex-col"}>
                    <Illustration name={"website"}/>
                    <div className={"flex gap-4 items-center justify-center"}>
                        <h1 className={"text-center"}>{website?.title}</h1>
                        <Button
                            actionType={ActionTypeEnum.neutral}
                            isLoading={titleLoading}
                            onClick={() => setShowPopupEditTitle(true)}
                            iconName={"edit"}/>
                    </div>

                    {
                        colorsLoading ? <LoadingIcon size={20} /> :
                            <AnimatePresence>
                                <motion.div
                                    key={"colors-section"}
                                    initial={{ opacity: 0, scale: 0, transformOrigin: "top center" }}
                                    animate={{ opacity: 1, scale: 1, transformOrigin: "top center" }}
                                    exit={{ opacity: 0, scale: 0, transformOrigin: "center" }}
                                    className={"flex gap-2 flex-wrap items-center justify-center max-w-125"}
                                >
                                    {

                                        colors ?
                                            <>
                                                <ColorItem
                                                    colorHexCode={colors.primary_color}
                                                    colorName={"Primary"}
                                                    changeColorAction={(newColor) => {
                                                        setNewColors(ColorUtil.setPrimaryColorAuto(newColors!, newColor))
                                                        editOrInsertWebsiteColorsAction()
                                                    }}
                                                />
                                                <ColorItem
                                                    colorHexCode={colors.secondary_color}
                                                    colorName={"Secondary"}
                                                    changeColorAction={(newColor) => {
                                                        setNewColors(ColorUtil.setSecondaryColorAuto(newColors!, newColor))
                                                        editOrInsertWebsiteColorsAction()
                                                    }}
                                                />
                                                <ColorItem
                                                    colorHexCode={colors.background_color}
                                                    colorName={"Background"}
                                                    changeColorAction={(newColor) => {
                                                        setNewColors(ColorUtil.setBackgroundColorAuto(newColors!, newColor))
                                                        editOrInsertWebsiteColorsAction()
                                                    }}
                                                />
                                                <ColorItem
                                                    colorHexCode={colors.text_color}
                                                    colorName={"Text"}
                                                    changeColorAction={(newColor) => {
                                                        setNewColors(ColorUtil.setTextColorAuto(newColors!, newColor))
                                                        editOrInsertWebsiteColorsAction()
                                                    }}
                                                />
                                            </> :
                                            <p>
                                                <Button
                                                    actionType={ActionTypeEnum.primary}
                                                    onClick={() => editOrInsertWebsiteColorsAction()}
                                                    text={"Personnalize colors"}
                                                    iconName={"paint"}/>
                                            </p>
                                    }
                                </motion.div>
                            </AnimatePresence>

                    }

                </div>

                <div className={"flex w-full justify-center items-center"}>
                    <StandardContainerForDataManagement
                        title={"Home page's content"}
                        message={"The content of the landing page of your website. This is the first page visitors will see when they access your website."}
                        illustrationName={"editing"}
                        actions={[{
                            isLoading: heroLoading,
                            text: "edit",
                            onClick: () => setShowPopupEditHero(true),
                            iconName: "edit",
                            actionType: ActionTypeEnum.primary
                        }]}
                    >
                        <h3>Title</h3>
                        <p>{website?.hero_title}</p>
                        <h3>Image</h3>
                        {website?.hero_image_url ?
                            <img src={website?.hero_image_url} alt={"Image de la landing page"}
                                 className={"md:max-w-96 max-w-full h-auto mb-4 rounded-lg"}/> :
                            <p className={"text-onForeground italic"}>You haven&apos;t uploaded any image yet</p>
                        }
                    </StandardContainerForDataManagement>
                </div>

                <List
                    title={"Pages"}
                    actions={
                        modifyPageOrder ?
                            [
                                {
                                    iconName: "close",
                                    onClick: cancelModifyPageOrder,
                                    actionType: ActionTypeEnum.dangerous
                                },
                                {
                                    iconName: "check",
                                    onClick: validateModifyPageOrder,
                                    actionType: ActionTypeEnum.primary
                                }
                            ] :
                            [

                                {
                                    actionType: ActionTypeEnum.neutral,
                                    iconName: "order",
                                    onClick: beginModifyPageOrder,
                                },
                                {
                                    isLoading: addPageLoading,
                                    onClick: () => setShowPopupForm(true),
                                    iconName: "add",
                                    actionType: ActionTypeEnum.primary
                                },
                            ]
                    }
                    elements={pages.map((page) => {
                        return {
                            text: page.title,
                            onClick: () => router.push(`/secure/${websiteId}/${page.id}`),
                            actions: modifyPageOrder ? [{
                                iconName: "up",
                                actionType: ActionTypeEnum.neutral,
                                onClick: () => movePageUp(page)
                            }, {
                                iconName: "down",
                                actionType: ActionTypeEnum.neutral,
                                onClick: () => movePageDown(page)
                            }] : undefined
                        }
                    })}/>

                <div className={"w-full flex items-center flex-wrap justify-center gap-4"}>
                    <StandardContainerForDataManagement
                        flex1={true}
                        title={"Domain"}
                        illustrationName={"domain"}
                        message={website?.website_domain || "Your website doesn't have any custom domain for the moment."}
                        actions={[{
                            isLoading: domainLoading,
                            text: "Edit",
                            onClick: () => setShowPopupEditDomain(true),
                            iconName: "edit",
                            actionType: ActionTypeEnum.primary
                        }]}
                    >
                    </StandardContainerForDataManagement>
                    <StandardContainerForDataManagement
                        flex1={true}
                        title={"Delete this website"}
                        illustrationName={"bin"}
                        message={"Deleting this website will cause the lost of all linked data."}
                        actions={[{
                            isLoading: deleteLoading,
                            text: "Delete",
                            onClick: () => setShowPopupDelete(true),
                            iconName: "trash",
                            actionType: ActionTypeEnum.dangerous
                        }]}>
                    </StandardContainerForDataManagement>
                </div>




            </MainPageWrapper>

            <AdvancedPopup show={showPopup} message={popupText} title={popupTitle}
                           closePopup={() => setShowPopup(false)}/>

            <AdvancedPopup
                show={showPopupDelete}
                message={"The content of this site will be permanently deleted. This action cannot be undone."}
                title={"Do you really want to delete this website ?"}
                icon={"trash"}
                actions={[
                    {
                        text: "Delete",
                        actionType: ActionTypeEnum.dangerous,
                        iconName: "trash",
                        onClick: deleteWebsiteAction
                    },
                ]}
                closePopup={() => setShowPopupDelete(false)}/>

            <Form onSubmitAction={addPageAction}>
                <AdvancedPopup show={showPopupForm}
                               message={"Enter the information of the new page below :"}
                               title={"Create a new page"}
                               icon={"add"}
                               actions={[
                                   {
                                       text: "Create",
                                       isForm: true,
                                       iconName: "check",
                                       isDisabled: StringUtil.pathStringValidator(newPagePath) !== null || StringUtil.basicStringValidator(newPagePath) !== null,
                                       actionType: ActionTypeEnum.primary
                                   }
                               ]}
                               closePopup={() => setShowPopupForm(false)}>

                    <Input placeholder={"path"} value={newPagePath} setValueAction={setNewPagePath}
                           validatorAction={StringUtil.pathStringValidator}
                           iconName={"globe"}/>
                    <Input placeholder={"title"} value={newPageTitle} setValueAction={setNewPageTitle} validatorAction={StringUtil.basicStringValidator}/>

                    <Textarea value={newPageDescription} onChangeAction={setNewPageDescription}
                              placeholder={"description"}/>

                    <Textarea value={newPageIcon} onChangeAction={setNewPageIcon}
                              placeholder={"svg icon"}/>
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={editTitleAction}>
                <AdvancedPopup
                    icon={"edit"}
                    show={showPopupEditTitle} title={"Edit website title"}
                    message={"Enter the new title"} actions={[{
                    text: "Edit",
                    isForm: true,
                    iconName: "check",
                    isDisabled: StringUtil.basicStringValidator(newWebsiteTitle) !== null,
                    actionType: ActionTypeEnum.primary
                }]} closePopup={() => setShowPopupEditTitle(false)}
                >
                    <Input
                        placeholder={"new title"} value={newWebsiteTitle}
                        setValueAction={setNewWebsiteTitle} validatorAction={StringUtil.basicStringValidator}/>
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={editDomainAction}>
                <AdvancedPopup
                    icon={"edit"}
                    show={showPopupEditDomain}
                    title={"Edit website domain"}
                    message={"Enter the new domain"} actions={[{
                    text: "Edit",
                    isForm: true,
                    iconName: "check",
                    actionType: ActionTypeEnum.primary
                }]} closePopup={() => setShowPopupEditDomain(false)}>

                    <Input iconName={"globe"} validatorAction={StringUtil.emptyableDomainValidator}
                           placeholder={"new domain"} value={newWebsiteDomain || ""}
                           setValueAction={setNewWebsiteDomain}/>
                    {
                        website?.website_domain ?
                            <div className={"bg-onBackgroundHover rounded-xl p-3 flex gap-2 items-center"}>
                                <img src={"/ico/info.svg"} alt={'info'} className={"invert w-12 h-fit"}/>
                                <p>If you enter an empty domain, your website will still be accessible through
                                    prism&apos;s
                                    domain.</p>
                            </div> :
                            <div className={"bg-dangerous rounded-xl p-3 flex gap-2 items-center"}>
                                <img src={"/ico/warning.svg"} alt={'warning'} className={"invert w-12 h-fit"}/>
                                <p>Careful, you need to have properly configured your project to use a custom
                                    domain.</p>
                            </div>
                    }

                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={editHeroAction}>
                <AdvancedPopup
                    icon={"edit"}
                    show={showPopupEditHero}
                    title={"Edit landing page content"}
                    message={"Enter the new information for your landing page below :"}
                    actions={[{
                        text: "Edit",
                        isForm: true,
                        iconName: "check",
                        actionType: ActionTypeEnum.primary
                    }]} closePopup={() => setShowPopupEditHero(false)}>
                    <Input placeholder={"title"} value={newWebsiteHeroTitle} setValueAction={setNewWebsiteHeroTitle}/>
                    <ImageInput setFileAction={setNewWebsiteHeroFile}/>
                </AdvancedPopup>
            </Form>
        </>

    )
}