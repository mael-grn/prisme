"use client"

import {useEffect, useState} from "react";
import {InsertableSection, Section} from "@/app/models/Section";
import {FieldsUtil} from "@/app/utils/fieldsUtil";
import {Element, InsertableElement} from "@/app/models/Element";
import {ImageUtil} from "@/app/utils/ImageUtil";
import {RecursiveCategory} from "@/app/models/Category";
import {Subcategory} from "@/app/models/Subcategory";
import ElementService from "@/app/services/elementService";
import CategoryService from "@/app/services/categoryService";
import SubcategoryService from "@/app/services/subCategoryService";
import {AnimatePresence, motion} from "framer-motion";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import Button, {ActionTypeEnum} from "../ui-elements/Button";
import List from "@/app/components/page-elements/List";
import StringUtil from "@/app/utils/StringUtil";
import AdvancedPopup from "../overlays/AdvancedPopup";
import Form from "@/app/components/forms-inputs/form";
import Input from "@/app/components/forms-inputs/Input";
import DropDown from "@/app/components/forms-inputs/DropDown";
import SectionService from "@/app/services/sectionService";
import CategorySelection from "@/app/components/forms-inputs/categorySelection";
import ImageInput from "@/app/components/forms-inputs/imageInput";
import Textarea from "@/app/components/forms-inputs/textarea";
import Illustration, {IllustrationSizes} from "@/app/components/ui-elements/Illustration";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";

export default function SectionAsPopup({section, updateSectionAction, deleteSectionAction, setSectionNullAction}: {
    section: Section | null,
    updateSectionAction: (section: Section) => Promise<void>,
    deleteSectionAction: () => void,
    setSectionNullAction: () => void
}) {

    const [loading, setLoading] = useState(true);
    const [elementsLoading, setElementsLoading] = useState(true);
    const [addingElementLoading, setAddingElementLoading] = useState(false);
    const [titleLoading, setTitleLoading] = useState(false);
    const [typeLoading, setTypeLoading] = useState(false);

    const [categoriesLoading, setCategoriesLoading] = useState(true);


    const [elements, setElements] = useState<Element[] | null>([]);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [popupTitle, setPopupTitle] = useState<string>('');

    const [showPopupNewElement, setShowPopupNewElement] = useState(false);
    const [showPopupEditSectionType, setShowPopupEditSectionType] = useState(false);
    const [showPopupEditSectionTitle, setShowPopupEditSectionTitle] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState<boolean>(false);
    const [showPopupNewCategory, setShowPopupNewCategory] = useState<boolean>(false);
    const [showPopupNewSubcategory, setShowPopupNewSubcategory] = useState<boolean>(false);
    const [showPopupAddSubcategoryToSection, setShowPopupAddSubcategoryToSection] = useState<boolean>(false);
    const [showPopupDeleteElement, setShowPopupDeleteElement] = useState<boolean>(false);
    const [showPopupEditElementContent, setShowPopupEditElementContent] = useState(false);

    const [modifyElementOrder, setModifyElementOrder] = useState<boolean>(false);
    const [modifiedElements, setModifiedElements] = useState<number[]>([]);

    const [newElementContent, setNewElementContent] = useState<string>('');
    const [newElementFile, setNewElementFile] = useState<File | null>(null);

    const [newElementType, setNewElementType] = useState<string>('');

    const [elementToDelete, setElementToDelete] = useState<number | null>(null);

    const [elementToEdit, setElementToEdit] = useState<number | null>(null);
    const [editedElementContent, setEditedElementContent] = useState<string>('');
    const [editedElementFile, setEditedElementFile] = useState<File | null>(null);

    const [newSectionTitle, setNewSectionTitle] = useState<string>('');
    const [newSectionType, setNewSectionType] = useState<string>('');

    const [allRecursiveCategories, setAllRecursiveCategories] = useState<RecursiveCategory[]>([]);
    const [sectionsSubcategories, setSectionsSubcategories] = useState<Subcategory[]>([]);

    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newSubcategoryName, setNewSubcategoryName] = useState<string>('');
    const [newSubcategoryParentCategoryId, setNewSubcategoryParentCategoryId] = useState<number | null>(null);

    const [selectedSubcategories, setSelectedSubcategories] = useState<Subcategory[]>([]);


    useEffect(() => {
        if (!section) return;

        async function loadData() {
            if (!section) return;
            setNewSectionType(section.section_type);
            setNewSectionTitle(section.title);
            setNewElementType(ElementService.getElementTypes()[0])
        }

        async function loadCategories() {
            if (!section) return;
            setAllRecursiveCategories(await CategoryService.getAllRecursiveCategories());
            const sectionSubcats = await SubcategoryService.getSubcategoriesFromSectionId(section.id);
            setSectionsSubcategories(sectionSubcats);
            setSelectedSubcategories(sectionSubcats);
        }

        async function loadElements() {
            if (!section) return;
            setElements(await ElementService.getElementsFromSectionId(section.id));
            setNewSectionType(ElementService.getElementTypes()[0]);
        }

        loadData().catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'Unknown error');
            setShowPopup(true);
        }).finally(() => {
            setLoading(false);
        })

        loadElements().catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'Unknown error');
            setShowPopup(true);
        }).finally(() => {
            setElementsLoading(false);
        })

        loadCategories().catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'unknown error');
            setShowPopup(true);
        }).finally(() => {
            setCategoriesLoading(false);
        })

    }, [section]);


    async function updateSection() {
        setShowPopupEditSectionType(false);
        if (!section) return;

        const insertableSection: InsertableSection = {
            title: newSectionTitle,
            page_id: section.page_id,
            position: section.position,
            section_type: newSectionType
        }
        const validation = FieldsUtil.checkSection(insertableSection)
        if (!validation.valid) {
            setPopupTitle("Something is wrong with the data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        setTypeLoading(true);
        setTitleLoading(true)
        try {
            await updateSectionAction({
                id: section.id,
                title: newSectionTitle,
                page_id: section.page_id,
                position: section.position,
                section_type: newSectionType
            })
        } catch (error) {
            setPopupTitle("Something went wrong");
            setPopupText(error as string || 'Unknown error');
            setShowPopup(true);
        } finally {
            setTypeLoading(false);
            setTitleLoading(false)
        }
    }

    function catContainsOneOfSectionSubcat(recursiveCategory: RecursiveCategory) {
        for (const subcategory of recursiveCategory.subcategories) {
            if (sectionsSubcategories.find((s) => s.id == subcategory.id)) {
                return true;
            }
        }
        return false;
    }

    async function addElementAction() {
        setShowPopupNewElement(false);
        if (!section) return;


        const newElement: InsertableElement = {
            section_id: section.id,
            element_type: newElementType,
            content: newElementContent
        }
        const validation = FieldsUtil.checkElement(newElement)

        if (!validation.valid) {
            setPopupTitle("Invalid data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        setAddingElementLoading(true);

        if (newElementType === 'image') {
            if (newElementFile) {
                newElement.content = await ImageUtil.uploadImage(newElementFile)
            } else {
                setPopupTitle("invalid data");
                setPopupText("You have selected the 'image' type but have not uploaded any image.");
                setShowPopup(true);
                return;
            }
        }

        ElementService.insertElement(newElement).then(async () => {
            setElements(await ElementService.getElementsFromSectionId(section.id));
        }).catch((error) => {
            setPopupTitle("Something went wrong");
            setPopupText(error);
            setShowPopup(true);
        }).finally(() => {
            setAddingElementLoading(false);
        })
    }

    function beginModifyElementOrder() {
        setModifyElementOrder(true);
    }

    async function cancelModifyElementOrder() {
        if (!section) return;
        setModifyElementOrder(false);

        setElementsLoading(true)
        setElements(await ElementService.getElementsFromSectionId(section.id));
        setElementsLoading(false);
    }

    function validateModifyElementOrder() {
        setElementsLoading(true);

        async function loadData() {
            if (!elements || !section) {
                return;
            }
            for (const elem of elements) {
                if (modifiedElements && modifiedElements.includes(elem.id)) {
                    try {
                        await ElementService.moveElement(elem);
                    } catch (e) {
                        setPopupTitle("Something went wrong");
                        setPopupText(typeof e === 'string' ? e : 'Unknown error');
                        setShowPopup(true);
                        setElements(await ElementService.getElementsFromSectionId(section.id));
                        setElementsLoading(false);
                        return
                    }

                }
            }
            setElements(await ElementService.getElementsFromSectionId(section.id));
            setElementsLoading(false);
        }

        loadData();
        setModifyElementOrder(false);
    }

    function moveElementUp(element: Element) {
        if (!elements) {
            return;
        }
        const newElements: Element[] = [...elements];
        if (element.position === 1) {
            return;
        }

        const modSect: number[] = [...modifiedElements];
        modSect?.push(newElements.find(s => s.position === element.position - 1)!.id);
        modSect?.push(element.id);
        setModifiedElements(modSect)

        newElements.find(s => s.position === element.position - 1)!.position++;
        newElements.find(s => s.id === element.id)!.position--;
        newElements.sort((a, b) => a.position - b.position);
        setElements(newElements);
    }

    function moveElementDown(element: Element) {
        if (!elements) {
            return;
        }
        const newElements: Element[] = [...elements];
        if (element.position === elements.length) {
            return;
        }

        const modSect: number[] = [...modifiedElements];
        modSect?.push(newElements.find(s => s.position === element.position + 1)!.id);
        modSect?.push(element.id);
        setModifiedElements(modSect)

        newElements.find(s => s.position === element.position + 1)!.position--;
        newElements.find(s => s.id === element.id)!.position++;
        newElements.sort((a, b) => a.position - b.position);
        setElements(newElements);
    }

    async function insertNewCategoryAction() {
        setShowPopupNewCategory(false);
        const validation = FieldsUtil.checkCategory({name: newCategoryName});
        if (!validation.valid) {
            setPopupTitle("Invalid data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        setCategoriesLoading(true);

        try {
            await CategoryService.createCategory({name: newCategoryName});
            setAllRecursiveCategories(await CategoryService.getAllRecursiveCategories())
            setNewCategoryName('');
        } catch (e) {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'unknown error');
            setShowPopup(true);
        } finally {
            setCategoriesLoading(false);
            setShowPopupAddSubcategoryToSection(true)
        }
    }

    async function insertNewSubcategoryAction() {
        setShowPopupNewSubcategory(false);
        if (newSubcategoryParentCategoryId === null) {
            setPopupTitle("Invalid data");
            setPopupText("You must select a parent category.");
            setShowPopup(true);
            return;
        }
        const validation = FieldsUtil.checkSubCategory({
            name: newSubcategoryName,
            category_id: newSubcategoryParentCategoryId
        });
        if (!validation.valid) {
            setPopupTitle("Invalid data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        setCategoriesLoading(true);

        try {
            await SubcategoryService.createSubCategoryForCategory({
                name: newSubcategoryName,
                category_id: newSubcategoryParentCategoryId as number
            });
            setAllRecursiveCategories(await CategoryService.getAllRecursiveCategories())
            setNewSubcategoryName('');
            setNewSubcategoryParentCategoryId(null);
        } catch (e) {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'Unknown error');
            setShowPopup(true);
        } finally {
            setCategoriesLoading(false);
            setShowPopupAddSubcategoryToSection(true)
        }
    }

    async function addSubcategoriesToSectionAction() {
        setShowPopupAddSubcategoryToSection(false);
        if (!section) return;
        if (selectedSubcategories === sectionsSubcategories) {
            return;
        }

        setCategoriesLoading(true);

        try {
            for (const subcategory of selectedSubcategories) {
                if (sectionsSubcategories.findIndex((s) => s.id === subcategory.id) === -1) {
                    await SectionService.addSubcategory(section, subcategory);
                }
            }
            for (const subcategory of sectionsSubcategories) {
                if (selectedSubcategories.findIndex((s) => s.id === subcategory.id) === -1) {
                    await SectionService.removeSubcategory(section, subcategory);
                }
            }
            const updatedSubcategories = await SubcategoryService.getSubcategoriesFromSectionId(section.id);
            setSectionsSubcategories(updatedSubcategories);
            setSelectedSubcategories(updatedSubcategories);
        } catch (e) {
            setPopupTitle("Something went wrong");
            setPopupText(typeof e === 'string' ? e : 'Unknown error');
            setShowPopup(true);
        } finally {
            setCategoriesLoading(false);
        }
    }

    async function deleteElementAction() {
        setShowPopupDeleteElement(false)
        if (!elementToDelete) return;
        setElementsLoading(true);
        const element = elements?.find((el) => el.id === elementToDelete);
        if (!element) return;
        ElementService.deleteElement(element).then(async () => {
            setElementToDelete(null)
            setElements(await ElementService.getElementsFromSectionId(element.section_id));
        }).catch((e) => {
            setPopupTitle("Something went wrong");
            setPopupText(e);
            setShowPopup(true);
        }).finally(() => {
            setElementsLoading(false);
        })
    }

    async function updateElementAction() {
        setShowPopupEditElementContent(false);
        if (!elementToEdit) return;
        const element = elements?.find((el) => el.id === elementToEdit);
        if (!element) return;
        const insertableElement: InsertableElement = {
            section_id: element.section_id,
            element_type: element.element_type,
            content: editedElementContent,

        }
        const validation = FieldsUtil.checkElement(insertableElement)
        if (!validation.valid) {
            setPopupTitle("Invalid data");
            setPopupText(validation.errors.join(', '));
            setShowPopup(true);
            return;
        }

        const updatedElement: Element = {
            ...insertableElement,
            id: element.id,
            position: element.position
        }

        if (element.element_type === 'image') {
            if (editedElementFile) {
                updatedElement.content = await ImageUtil.uploadImage(editedElementFile)
            } else {
                setPopupTitle("Invalid data");
                setPopupText("You have selected the 'image' type but have not uploaded any image.");
                setShowPopup(true);
                return;
            }
        }

        setElementsLoading(true);
        ElementService.updateElement(updatedElement).then(async () => {
            setElementToEdit(null)
            setEditedElementContent("")
            setEditedElementFile(null)
            setElements(await ElementService.getElementsFromSectionId(updatedElement.section_id));
        }).catch((error) => {
            setPopupTitle("Something went wrong");
            setPopupText(error);
            setShowPopup(true);
        }).finally(() => {
            setElementsLoading(false);
        })
    }

    return (
        <>

            <AnimatePresence>
                {
                    section && <motion.div
                        className={"fixed top-0 p-10 left-0 w-full h-full flex items-center justify-center bg-background-opacity z-999"}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <StandardContainerForDataManagement
                            className={"md:min-w-1/3"}
                            title={"Edit your section"}
                            actions={[
                                {
                                    text: "Close",
                                    iconName: "close",
                                    onClick: setSectionNullAction,
                                    actionType: ActionTypeEnum.neutral
                                },
                                {
                                    text: "Delete",
                                    iconName: "trash",
                                    onClick: () => setShowPopupDelete(true),
                                    actionType: ActionTypeEnum.dangerous
                                }
                            ]}>

                            <div className={"w-full flex flex-col justify-center items-center"}>
                                <Illustration name={"lego"}/>
                                <div className={"flex items-center gap-2"}>
                                    <h1>{section?.title}</h1>
                                    <Button
                                        isLoading={titleLoading}
                                        actionType={ActionTypeEnum.neutral}
                                        onClick={() => setShowPopupEditSectionTitle(true)}
                                        iconName={"edit"}/>
                                </div>

                                <div className={`flex gap-2 items-center justify-center bg-background border-2 border-on-background p-1 ${!typeLoading && "pl-3"} rounded-full`}>
                                    {
                                        typeLoading ? <LoadingIcon size={15}/> : <>
                                            <p className={"text-center"}>{section.section_type}</p>
                                            <Button
                                                actionType={ActionTypeEnum.neutral}
                                                onClick={() => setShowPopupEditSectionType(true)}
                                                small={true}
                                                iconName={"edit"}/>
                                        </>
                                    }

                                </div>

                            </div>

                            <StandardContainerForDataManagement
                                title={"Categories"}
                                loading={categoriesLoading}
                                className={"w-full"}
                                actions={[
                                    {
                                        onClick: () => setShowPopupAddSubcategoryToSection(true),
                                        iconName: allRecursiveCategories.length === 0 || sectionsSubcategories.length === 0 ?  "add" : "edit",
                                    }
                                ]}
                            >
                                {
                                    allRecursiveCategories.length === 0 || sectionsSubcategories.length === 0 ?
                                        <div className={"flex items-center justify-center w-full flex-col gap-4"}>
                                            <Illustration name={"empty"} size={IllustrationSizes.SMALL}/>
                                            <h3>No category yet</h3>
                                        </div>
                                             : allRecursiveCategories.map((cat, index) => {
                                                 if (catContainsOneOfSectionSubcat(cat)) {
                                                     return <div key={index} className={"flex flex-col gap-2"}>
                                                         <h3>{cat.name}</h3>
                                                         <div className={"flex gap-2 flex-wrap"}>
                                                             {
                                                                 cat.subcategories.map((subcat, index) => {
                                                                     if (sectionsSubcategories.find((s) => s.id == subcat.id)) {
                                                                         return <p key={index} className={"px-2 py-1 bg-background border-on-background border-2 rounded-full"}>{subcat.name}</p>
                                                                     }
                                                                 })
                                                             }
                                                         </div>
                                                     </div>
                                                 }

                                        })
                                }
                            </StandardContainerForDataManagement>



                            <List
                                title={"Contenu"}
                                actions={ modifyElementOrder ? [{
                                    iconName: "close",
                                    onClick: cancelModifyElementOrder,
                                    actionType: ActionTypeEnum.dangerous
                                },
                                    {
                                        iconName: "check",
                                        onClick: validateModifyElementOrder,
                                    }
                                ] : [
                                {
                                    iconName: "order",
                                    actionType: ActionTypeEnum.neutral,
                                    onClick: beginModifyElementOrder,
                                },
                                {
                                    isLoading: addingElementLoading,
                                    onClick: () => setShowPopupNewElement(true),
                                    iconName: "add",
                                }]}

                                elements={elements?.map((elem) => {
                                return {
                                    text: elem.content,
                                    isImage: elem.element_type === "image",
                                    actions: modifyElementOrder ? [
                                        {
                                            iconName: "up",
                                            onClick: () => moveElementUp(elem)
                                        },
                                        {
                                            iconName: "down",
                                            onClick: () => moveElementDown(elem)
                                        }
                                    ] : [
                                        {
                                            iconName: "edit",
                                            type: ActionTypeEnum.primary,
                                            onClick: () => {
                                                setElementToEdit(elem.id);
                                                console.log(elem.content)
                                                if (elem.element_type !== "image") {
                                                    console.log("test")
                                                    setEditedElementContent(elem.content);
                                                }
                                                setShowPopupEditElementContent(true);
                                            }
                                        },
                                        {
                                            iconName: "trash",
                                            type: ActionTypeEnum.dangerous,
                                            onClick: () => {
                                                setElementToDelete(elem.id);
                                                setShowPopupDeleteElement(true);
                                            }
                                        }
                                    ]
                                }
                            }) ?? []}/>



                        </StandardContainerForDataManagement>
                    </motion.div>
                }
            </AnimatePresence>

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
                    onClick: () => {
                        setShowPopupDelete(false)
                        deleteSectionAction()
                    }
                }]}
                icon={"warning"}
                show={showPopupDelete}
                message={"This action is irreversible. You will also lose the items contained in this section."}
                title={`Do you really want to delete this section?`}
                closePopup={() => setShowPopupDelete(false)}
            />

            <Form onSubmitAction={updateSection}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditSectionTitle}
                    title={'Edit section\'s title'}
                    actions={[
                        {text: "Edit", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => setShowPopupEditSectionTitle(false)}
                >
                    <Input placeholder={"title"} value={newSectionTitle} setValueAction={setNewSectionTitle}/>
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={updateSection}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditSectionType}
                    title={'Edit section\'s type'}
                    actions={[
                        {text: "Edit", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => setShowPopupEditSectionType(false)}
                >
                    <DropDown items={SectionService.getSectionTypes()} selectedItem={newSectionType}
                              setSelectedItemAction={setNewSectionType}/>
                </AdvancedPopup>
            </Form>

            <Form onSubmitAction={insertNewCategoryAction}>
                <AdvancedPopup
                    icon={'add'}
                    show={showPopupNewCategory}
                    title={'Create a new category'}
                    actions={[
                        {text: "Create", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => {setShowPopupNewCategory(false); setShowPopupAddSubcategoryToSection(true)}}
                >
                    <Input placeholder={"name"} value={newCategoryName} setValueAction={setNewCategoryName}/>
                </AdvancedPopup>
            </Form>


            <Form onSubmitAction={insertNewSubcategoryAction}>
                <AdvancedPopup
                    icon={'add'}
                    show={showPopupNewSubcategory}
                    title={'Create a subcategory for ' + (newSubcategoryParentCategoryId ? allRecursiveCategories.find((cat) => cat.id === newSubcategoryParentCategoryId)?.name : 'UNKNOWN')}
                    actions={[
                        {text: "Create", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => {setShowPopupNewSubcategory(false); setShowPopupAddSubcategoryToSection(true)}}
                >
                    <Input placeholder={"name"} value={newSubcategoryName} setValueAction={setNewSubcategoryName}/>
                </AdvancedPopup>
            </Form>


            <Form onSubmitAction={addSubcategoriesToSectionAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupAddSubcategoryToSection}
                    title={'Manage categories'}
                    actions={[
                        {text: "Done", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => {setShowPopupAddSubcategoryToSection(false);}}
                >
                    <CategorySelection
                        recursiveCategoryList={allRecursiveCategories}
                        preSelectedSubcategories={sectionsSubcategories}
                        onSelectSubcategoryAction={(subcat) => setSelectedSubcategories([...selectedSubcategories, subcat])}
                        onDeselectSubcategoryAction={(subcat) => setSelectedSubcategories(selectedSubcategories.filter((s) => s.id !== subcat.id))}
                        onCreateNewCategoryPressedAction={() => {
                            setShowPopupAddSubcategoryToSection(false)
                            setShowPopupNewCategory(true)
                        }}
                        onCreateSubcategoryPressedAction={(category) => {
                            setShowPopupAddSubcategoryToSection(false)
                            setNewSubcategoryParentCategoryId(category.id)
                            setShowPopupNewSubcategory(true)
                        }}
                    />
                </AdvancedPopup>
            </Form>


            <Form onSubmitAction={addElementAction}>
                <AdvancedPopup
                    icon={'add'}
                    show={showPopupNewElement}
                    title={'Create a new element'}
                    actions={[
                        {text: "Create", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => setShowPopupNewElement(false)}
                >

                    <div className={"flex flex-col gap-4 items-center justify-center"}>
                        <DropDown items={ElementService.getElementTypes()} selectedItem={newElementType}
                                  setSelectedItemAction={setNewElementType}/>
                        <p>
                            {
                                newElementType === "title" ?
                                    "A title will be displayed in large, bold text; in short, it will be clearly visible!" :
                                    newElementType === "text" ?
                                        "Text will be displayed in the usual way, like a paragraph. Note that line breaks will not be recognized; to achieve this effect, you will need to add multiple paragraphs." :
                                        newElementType === "link" ?
                                            "Enter a link, and it will be clickable." :
                                            newElementType === "image" ?
                                                "Upload an image, and it will be stored in the cloud and displayed naturally!" :
                                                "Unknown element type"
                            }
                        </p>
                    </div>

                    {
                        newElementType === "title" ?
                            <Input placeholder={"title"} value={newElementContent}
                                   setValueAction={setNewElementContent}/> :
                            newElementType === "text" ?
                                <Textarea value={newElementContent} onChangeAction={setNewElementContent}/> :
                                newElementType === "link" ?
                                    <Input validatorAction={StringUtil.domainValidator} iconName={"globe"}
                                           placeholder={"link"} value={newElementContent}
                                           setValueAction={setNewElementContent}/> :
                                    newElementType === "image" ?
                                        <ImageInput setFileAction={setNewElementFile}/> :
                                        <p>unknown element type</p>
                    }

                </AdvancedPopup>
            </Form>


            <AdvancedPopup
                actions={[{
                    iconName: "trash",
                    text: "Delete",
                    actionType: ActionTypeEnum.dangerous,
                    onClick: deleteElementAction
                }]}
                icon={"warning"}
                show={showPopupDeleteElement}
                message={"This action is irreversible. This item will be permanently deleted."}
                title={`Do you really want to remove this item?`}
                closePopup={() => setShowPopupDeleteElement(false)}
            />

            <Form onSubmitAction={updateElementAction}>
                <AdvancedPopup
                    icon={'edit'}
                    show={showPopupEditElementContent}
                    message={"Enter the new content for the element:"}
                    title={'Edit element content'}
                    actions={[
                        {text: "Edit", iconName: "check", isForm: true},
                    ]}
                    closePopup={() => setShowPopupEditElementContent(false)}
                >
                    {
                        elements?.find((el) => el.id === elementToEdit)?.element_type === "title" ?
                            <Input placeholder={"title"} value={editedElementContent}
                                   setValueAction={setEditedElementContent}/> :
                            elements?.find((el) => el.id === elementToEdit)?.element_type === "text" ?
                                <Textarea value={editedElementContent} onChangeAction={setEditedElementContent}/> :
                                elements?.find((el) => el.id === elementToEdit)?.element_type === "link" ?
                                    <Input validatorAction={StringUtil.domainValidator} iconName={"globe"}
                                           placeholder={"link"} value={editedElementContent}
                                           setValueAction={setEditedElementContent}/> :
                                    elements?.find((el) => el.id === elementToEdit)?.element_type === "image" ?
                                        <ImageInput setFileAction={setEditedElementFile}/> :
                                        <p>Unknown element type</p>
                    }
                </AdvancedPopup>
            </Form>

        </>

    );
}