"use client"

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

import {InsertableSection, Section} from "@/app/models/Section";
import SectionService from "@/app/services/sectionService";
import PageService from "@/app/services/pageService";
import {InsertablePage, Page} from "@/app/models/Page";
import {FieldsUtil} from "@/app/utils/fieldsUtil";
import MainPageWrapper from "@/app/components/page-elements/MainPageWrapper";
import List from "@/app/components/page-elements/List";
import {DisplayWebsite} from "@/app/models/DisplayWebsite";
import WebsiteService from "@/app/services/WebsiteService";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import SvgFromString from "@/app/components/ui-elements/SvgFromString";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";
import Form from "@/app/components/forms-inputs/form";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import Textarea from "@/app/components/forms-inputs/textarea";
import DropDown from "@/app/components/forms-inputs/DropDown";
import Illustration from "@/app/components/ui-elements/Illustration";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import {AnimatePresence, motion} from "framer-motion";
import Icon from "@/app/components/ui-elements/Icon";
import {simpleElementVariant} from "@/app/utils/FramerUtil";
import SectionAsPopup from "@/app/components/page-elements/SectionAsPopup";

export default function PageVisu() {

    const [loading, setLoading] = useState(true);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [iconHovered, setIconHovered] = useState(false);

    const [sectionToVisualize, setSectionToVisualize] = useState<Section | null>(null);

    const [editTitleLoading, setEditTitleLoading] = useState(false);
    const [editPathLoading, setEditPathLoading] = useState(false);
    const [editDescriptionLoading, setEditDescriptionLoading] = useState(false);
    const [editIconLoading, setEditIconLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addSectionLoading, setAddSectionLoading] = useState(false);

    const [website, setWebsite] = useState<DisplayWebsite | null>(null);
    const [page, setPage] = useState<Page | null>(null);
    const [sectionTypes, setSectionTypes] = useState<string[]>([]);
    const [sections, setSections] = useState<Section[] | null>([]);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [popupTitle, setPopupTitle] = useState<string>('');

    const [showPopupNewSection, setShowPopupNewSection] = useState(false);
    const [showPopupEditTitle, setShowPopupEditTitle] = useState(false);
    const [showPopupEditPath, setShowPopupEditPath] = useState(false);
    const [showPopupEditDescription, setShowPopupEditDescription] = useState(false);
    const [showPopupEditIcon, setShowPopupEditIcon] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState<boolean>(false);

    const [modifySectionOrder, setModifySectionOrder] = useState<boolean>(false);
    const [modifiedSections, setModifiedSections] = useState<number[]>([]);

    const [newTitle, setNewTitle] = useState<string>('');
    const [newPath, setNewPath] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');
    const [newIcon, setNewIcon] = useState<string>('');

    const [newSectionType, setNewSectionType] = useState<string>('');
    const [newSectionTitle, setNewSectionTitle] = useState<string>('');


    const router = useRouter();
    const {websiteId, pageId} = useParams();

    useEffect(() => {
        async function loadData() {
            const tmpPage: Page = await PageService.getPageById(parseInt(pageId as string))
            setWebsite(await WebsiteService.getWebsiteById((parseInt(websiteId as string))));
            setPage(tmpPage)
            setNewTitle(tmpPage.title);
            setNewPath(tmpPage.path);
            setNewDescription(tmpPage.description || '');
            setNewIcon(tmpPage.icon_svg || '');
            setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
            setSectionTypes(SectionService.getSectionTypes);
            setNewSectionType(SectionService.getSectionTypes()[0]);
            setSectionsLoading(false);
        }

        loadData().catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'Unknown error');
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        })


    }, [websiteId, pageId]);

    function deletePageAction() {
        setShowPopupDelete(false)
        setDeleteLoading(true);
        if (!page) return;
        PageService.deletePage(page).then(() => {
            router.push('/secure/' + page.website_id);
        }).catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(e);
            setShowPopup(true);
        }).finally(() => {
            setDeleteLoading(false);
        })
    }

    async function deleteSectionAction() {
        if (!sectionToVisualize) return;
        const sectToDelete = sectionToVisualize;
        setSectionsLoading(true);
        setSectionToVisualize(null);

        try {
            await SectionService.deleteSection(sectToDelete);
            await setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
        } catch (err) {
            setPopupTitle("Something went wrong");
            setPopupText(typeof err === 'string' ? err : 'Unknown error');
            setShowPopup(true);
        } finally {
            setSectionsLoading(false);
        }
    }

    async function updateSectionAction(section: Section) {
        await SectionService.updateSection(section);
        const sections = await SectionService.getSectionsForPageId(parseInt(pageId as string));
        setSections(sections);
        setSectionToVisualize(sections.find(s => s.id === section.id) || null);
    }


    function updatePageAction() {
        const editingTitle = showPopupEditTitle;
        const editingPath = showPopupEditPath;
        const editingDescription = showPopupEditDescription;
        const editingIcon = showPopupEditIcon;

        setShowPopupEditTitle(false);
        setShowPopupEditPath(false);
        setShowPopupEditDescription(false);
        setShowPopupEditIcon(false);
        if (!page) return;
        const insertablePage: InsertablePage = {
            title: newTitle,
            website_id: page.website_id,
            path: newPath,
            icon_svg: newIcon,
            description: newDescription,
        }
        const validation = FieldsUtil.checkPage(insertablePage)
        if (!validation.valid) {
            setPopupTitle("Something went wrong");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        const updatedPage: Page = {
            position: page.position,
            ...insertablePage,
            id: page.id
        }

        setEditTitleLoading(editingTitle);
        setEditPathLoading(editingPath);
        setEditDescriptionLoading(editingDescription);
        setEditIconLoading(editingIcon);
        PageService.updatePage(updatedPage).then(async () => {
            const tmp = await PageService.getPageById(parseInt(pageId as string))
            setPage(tmp);
            setNewTitle(tmp.title);
            setNewPath(tmp.path);
            setNewDescription(tmp.description || '');
            setNewIcon(tmp.icon_svg || '');
        }).catch((error) => {
            setPopupTitle("Something went wrong");
            setPopupText(error);
            setShowPopup(true);
        }).finally(() => {
            setEditTitleLoading(false);
            setEditPathLoading(false);
            setEditDescriptionLoading(false);
            setEditIconLoading(false);
        })
    }

    function addSectonAction() {
        setShowPopupNewSection(false);
        const newSection: InsertableSection = {
            title: newSectionTitle,
            page_id: parseInt(pageId as string),
            position: 0,
            section_type: newSectionType
        }
        const validation = FieldsUtil.checkSection(newSection)
        if (!validation.valid) {
            setPopupTitle("Invalid section data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        setAddSectionLoading(true);
        SectionService.insertSection(newSection).then(async () => {
            setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
        }).catch((error) => {
            setPopupTitle("Something went wrong");
            setPopupText(error);
            setShowPopup(true);
        }).finally(() => {
            setAddSectionLoading(false);
        })
    }

    function beginModifySectionOrder() {
        setModifySectionOrder(true);
    }

    async function cancelModifySectionOrder() {
        setModifySectionOrder(false);

        setSectionsLoading(true)
        setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
        setSectionsLoading(false);
    }

    function validateModifySectionOrder() {
        setSectionsLoading(true);

        async function loadData() {
            if (!sections) {
                return;
            }
            for (const sect of sections) {
                if (modifiedSections && modifiedSections.includes(sect.id)) {
                    try {
                        await SectionService.moveSection(sect);
                    } catch (e) {
                        setPopupTitle("Something went wrong");
                        setPopupText(typeof e === 'string' ? e : 'Unknown error');
                        setShowPopup(true);
                        setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
                        setSectionsLoading(false);
                        return
                    }

                }
            }
            setSections(await SectionService.getSectionsForPageId(parseInt(pageId as string)));
            setSectionsLoading(false);
        }

        loadData();
        setModifySectionOrder(false);
    }

    function moveSectionUp(section: Section) {
        if (!sections) {
            return;
        }
        const newSections: Section[] = [...sections];
        if (section.position === 1) {
            return;
        }

        const modSect: number[] = [...modifiedSections];
        modSect?.push(newSections.find(s => s.position === section.position - 1)!.id);
        modSect?.push(section.id);
        setModifiedSections(modSect)

        newSections.find(s => s.position === section.position - 1)!.position++;
        newSections.find(s => s.id === section.id)!.position--;
        newSections.sort((a, b) => a.position - b.position);
        setSections(newSections);
    }

    function moveSectionDown(section: Section) {
        if (!sections) {
            return;
        }
        const newSections: Section[] = [...sections];
        if (section.position === sections.length) {
            return;
        }

        const modSect: number[] = [...modifiedSections];
        modSect?.push(newSections.find(s => s.position === section.position + 1)!.id);
        modSect?.push(section.id);
        setModifiedSections(modSect)

        newSections.find(s => s.position === section.position + 1)!.position--;
        newSections.find(s => s.id === section.id)!.position++;
        newSections.sort((a, b) => a.position - b.position);
        setSections(newSections);
    }

    return (
        <>
            <MainPageWrapper loading={loading}>

                {
                    website && website.hero_image_url && <img src={website.hero_image_url} alt={"hero image"}
                                                              className={"fixed top-0 left-0 bottom-0 right-0 w-full h-screen object-cover select-none z-0"}/>
                }

                <Button iconName={"arrow-back"} text={"Back to " + website?.title} actionType={ActionTypeEnum.neutral}
                        onClick={() => router.push("/secure/" + websiteId)}/>
                <div className={"flex justify-center w-full relative gap-4 items-center flex-col"}>
                    <div className={"relative"}>
                        {
                            editIconLoading ? <LoadingIcon/> :
                            page?.icon_svg
                                ? <div className={"p-6 bg-background border-2 border-on-background rounded-full"}>
                                    <SvgFromString className={"w-10 h-10"} svg={page!.icon_svg} color={"foreground"} alt="icone"/>
                                </div> : <Illustration name={"document"}/>
                        }
                        <div
                            className={"absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer"}
                            onMouseEnter={() => setIconHovered(true)}
                            onMouseLeave={() => setIconHovered(false)}
                            onClick={() => {setShowPopupEditIcon(true); setIconHovered(false)}}
                        >
                            <AnimatePresence>
                                {
                                    iconHovered &&
                                    <motion.div className={"bg-background/70 backdrop-blur-lg p-3 rounded-full"}
                                    initial={simpleElementVariant.hidden}
                                    animate={simpleElementVariant.visible}
                                    exit={simpleElementVariant.hidden}
                                    >
                                        <Icon iconName={"edit"}/>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    </div>


                    <div className={"flex gap-4 items-center justify-center"}>
                        <h1 className={"text-center"}>{page?.title}</h1>
                        <Button
                            actionType={ActionTypeEnum.neutral}
                            isLoading={editTitleLoading}
                            onClick={() => setShowPopupEditTitle(true)}
                            iconName={"edit"}/>
                    </div>

                    <div className={`flex gap-2 items-center justify-center bg-background border-2 border-on-background p-1 ${!editPathLoading && "pl-3"} rounded-full`}>
                        {
                            editPathLoading ? <LoadingIcon size={15}/> : <>
                                <p className={"text-center"}>{page?.path}</p>
                                <Button
                                    actionType={ActionTypeEnum.neutral}
                                    onClick={() => setShowPopupEditPath(true)}
                                    small={true}
                                    iconName={"edit"}/>
                            </>
                        }

                    </div>
                    <StandardContainerForDataManagement
                        illustrationName={"pencil"}
                        flex1={true}
                        title={"Description"}
                        message={page?.description || "Your page does not have any description for the moment."}
                        actions={[{
                            isLoading: editDescriptionLoading,
                            text: "Edit",
                            onClick: () => setShowPopupEditDescription(true),
                            iconName: "edit",
                        }]}>
                    </StandardContainerForDataManagement>
                </div>

                <List
                    title={"Page's content"}
                    actions={modifySectionOrder ? [
                        {
                            iconName: "close",
                            onClick: cancelModifySectionOrder,
                            actionType: ActionTypeEnum.dangerous
                        },
                        {
                            iconName: "check",
                            onClick: validateModifySectionOrder,
                        }
                    ] : [
                        {
                            iconName: "order",
                            actionType: ActionTypeEnum.neutral,
                            onClick: beginModifySectionOrder,
                        },
                        {
                            isLoading: addSectionLoading,
                            onClick: () => setShowPopupNewSection(true),
                            iconName: "add",
                            actionType: ActionTypeEnum.primary
                        }
                    ]}
                    elements={sections?.map((sect) => {
                        return {
                            text: sect.title,
                            tag: sect.section_type,
                            onClick: () => setSectionToVisualize(sect),
                            actions: modifySectionOrder ? [{
                                iconName: "up",
                                onClick: () => moveSectionUp(sect)
                            }, {iconName: "down", onClick: () => moveSectionDown(sect)}] : undefined
                        }
                    }) ?? []}/>

                <div className={"w-full flex items-center justify-center"}>
                    <StandardContainerForDataManagement
                        illustrationName={"bin"}
                        message={"Deleting this page will cause the loss of all itss content."}
                        title={"Delete"} actions={[{
                        isLoading: deleteLoading,
                        text: "Delete",
                        onClick: () => setShowPopupDelete(true),
                        iconName: "trash",
                        actionType: ActionTypeEnum.dangerous
                    }]}>
                    </StandardContainerForDataManagement>
                </div>




            </MainPageWrapper>

            <AdvancedPopup
                show={showPopup}
                message={popupText}
                title={popupTitle}
                closePopup={() => setShowPopup(false)}
            />

            <AdvancedPopup
                actions={[{
                    iconName: "trash",
                    text: "Delete",
                    actionType: ActionTypeEnum.dangerous,
                    onClick: deletePageAction
                }]}
                icon={"warning"}
                show={showPopupDelete}
                message={"This action is irreversible. All the content of this page will be lost."}
                title={`Do you really want to delete "${page?.title}" ?`}
                closePopup={() => setShowPopupDelete(false)}
            />

            <Form onSubmitAction={updatePageAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditTitle}
                    message={"Provide the new title of the page :"}
                    title={"Edit page's title"}
                    actions={[
                        {
                            text: "Edit",
                            isDisabled: StringUtil.basicStringValidator(newTitle) !== null,
                            iconName: "check",
                            isForm: true,
                            actionType: ActionTypeEnum.primary},

                    ]}
                    closePopup={() => setShowPopupEditTitle(false)}
                >
                    <Input placeholder={"title"} value={newTitle} setValueAction={setNewTitle} validatorAction={StringUtil.basicStringValidator}
                    />
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={updatePageAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditPath}
                    message={"Provide the new path of the page :"}
                    title={"Edit page's path"}
                    actions={[
                        {text: "Edit",
                            iconName: "check",
                            isDisabled: StringUtil.pathStringValidator(newPath) !== null,
                            isForm: true,
                            actionType: ActionTypeEnum.primary},
                    ]}
                    closePopup={() => setShowPopupEditPath(false)}
                >
                    <Input validatorAction={StringUtil.pathStringValidator} placeholder={"path"} value={newPath}
                           setValueAction={setNewPath}
                    />
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={updatePageAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditDescription}
                    message={"Provide the new description of the page :"}
                    title={"Edit page's description"}
                    actions={[
                        {text: "Edit", iconName: "check", isForm: true, actionType: ActionTypeEnum.primary},
                    ]}
                    closePopup={() => setShowPopupEditDescription(false)}
                >
                    <Textarea placeholder={"description"} value={newDescription} onChangeAction={setNewDescription}
                    />
                </AdvancedPopup>
            </Form>


            <Form onSubmitAction={updatePageAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditIcon}
                    message={"Provide the new SVG icon of the page :"}
                    title={"Edit page's icon"}
                    actions={[
                        {text: "Edit",
                            iconName: "check",
                            isDisabled: StringUtil.svgOrEmptyStringValidator(newIcon) !== null,
                            isForm: true},
                    ]}
                    closePopup={() => setShowPopupEditIcon(false)}
                >
                    <Textarea placeholder={"SVG icon"} value={newIcon} onChangeAction={setNewIcon} validatorAction={StringUtil.svgOrEmptyStringValidator}
                    />
                    <div className={"flex gap-2 items-center"}>
                        <Icon iconName={"question"}/>
                        <p>To find an icon for your page, you can use <a className={"text-blue-600 underline"}
                                                                         target={"_blank"} href={"https://heroicons.com/"}>Hero
                            Icon</a>. Copy the icon of your choice and paste it right there.</p>
                    </div>
                </AdvancedPopup>
            </Form>


            <Form onSubmitAction={addSectonAction}>
                <AdvancedPopup
                    icon={'add'}
                    show={showPopupNewSection}
                    message={"The title will not be visible to users, but will allow you to find the section more easily when making changes."}
                    title={'Create a section'}
                    actions={[
                        {text: "Create",
                            isDisabled: StringUtil.basicStringValidator(newSectionTitle) !== null || !newSectionType,
                            iconName: "check",
                            isForm: true},
                    ]}
                    closePopup={() => setShowPopupNewSection(false)}
                >
                    <Input placeholder={"title"} value={newSectionTitle} setValueAction={setNewSectionTitle} validatorAction={StringUtil.basicStringValidator}/>

                    <h3>Please also select a way for the section to be displayed</h3>
                    <DropDown items={sectionTypes} selectedItem={newSectionType} setSelectedItemAction={setNewSectionType}/>

                    <p className={"w-125"}>
                        {
                            newSectionType === "classic" ?
                                "A classic section containing various elements that will be displayed one after the other." :
                                newSectionType === "develop" ?
                                    "This resembles a standard section, except that only the title is displayed by default. You need to click on it to see the full content. This is recommended when there is a lot of content to display, to avoid overloading the page." :
                                    newSectionType === "tile" ?
                                        "Similar to an expanded section, but the default formatting changes: instead of a list where items are displayed one after the other and take up all the space, the items are sort of like small 'squares' with a layout that optimizes space." :
                                        "Unknown section type."
                        }
                    </p>

                </AdvancedPopup>
            </Form>


            <SectionAsPopup section={sectionToVisualize} deleteSectionAction={deleteSectionAction}
                            updateSectionAction={updateSectionAction}
                            setSectionNullAction={() => setSectionToVisualize(null)}/>

        </>
    );
}