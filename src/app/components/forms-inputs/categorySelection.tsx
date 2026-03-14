import {RecursiveCategory} from "@/app/models/Category";
import {Subcategory} from "@/app/models/Subcategory";
import {useState} from "react";
import {AnimatePresence, motion, Variants} from "framer-motion";
import Illustration, {IllustrationSizes} from "@/app/components/ui-elements/Illustration";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import Icon from "@/app/components/ui-elements/Icon";
import {simpleElementVariant} from "@/app/utils/FramerUtil";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";

export default function CategorySelection({
                                              recursiveCategoryList,
                                              preSelectedSubcategories = [],
                                              onSelectSubcategoryAction,
                                              onDeselectSubcategoryAction,
                                              onCreateNewCategoryPressedAction,
                                              onCreateSubcategoryPressedAction
                                          }: {
    recursiveCategoryList: RecursiveCategory[],
    preSelectedSubcategories?: Subcategory[],
    onSelectSubcategoryAction: (subcategory: Subcategory) => void,
    onDeselectSubcategoryAction: (subcategory: Subcategory) => void,
    onCreateNewCategoryPressedAction: () => void,
    onCreateSubcategoryPressedAction: (category: RecursiveCategory) => void,
}) {

    const [selectedSubcategories, setSelectedSubcategories] = useState<Subcategory[]>(preSelectedSubcategories);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const onCheckboxClick = (subcategory: Subcategory) => {
        const isSelected = selectedSubcategories.findIndex(s => s.id === subcategory.id) !== -1;
        if (isSelected) {
            setSelectedSubcategories(selectedSubcategories.filter(s => s.id !== subcategory.id));
            onDeselectSubcategoryAction(subcategory);
        } else {
            setSelectedSubcategories([...selectedSubcategories, subcategory]);
            onSelectSubcategoryAction(subcategory);
        }
    };

    if (recursiveCategoryList.length === 0) {
        return (
            <div className={"flex gap-2 items-center"}>
                <Illustration name={"empty"} size={IllustrationSizes.SMALL}/>
                <p>No category created yet</p>
            </div>
        );
    }

    return (
        <div className={"flex flex-col gap-2"}>
            {
                recursiveCategoryList.map((category) => (
                    <div key={category.id} className={`flex flex-col gap-3 w-full`}>
                        <div className="flex gap-4 items-center cursor-pointer"
                             onClick={() => {
                                 if (expandedCategories.includes(category.id)) {
                                     setExpandedCategories(expandedCategories.filter(id => id !== category.id));
                                 } else {
                                     setExpandedCategories([...expandedCategories, category.id]);
                                 }
                             }}
                        >
                            <Icon iconName={expandedCategories.includes(category.id) ? "chevron-down" : "chevron-right"}/>
                            <h3>{category.name}</h3>
                        </div>

                        <AnimatePresence initial={false}>
                            {
                                expandedCategories.includes(category.id) &&
                                <motion.div
                                    key={`container-${category.id}`}
                                    variants={simpleElementVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    layout
                                    style={{overflow: "hidden"}}
                                    className={"flex flex-col gap-2 pl-12 mb-4"}
                                >
                                    {
                                        category.subcategories.length === 0 ?
                                            <div
                                                key={`catselect-${category.id}`}
                                                className={"flex gap-2 items-center"}
                                            >
                                                <img src={"/ico/info.svg"} alt={"info"} className={"w-6 invert"}/>
                                                <p>Il n&apos;existe aucune sous-catégories pour le moment.</p>
                                            </div>
                                            :
                                            category.subcategories.map((subcategory) => {
                                                const isChecked = selectedSubcategories.findIndex(s => s.id === subcategory.id) !== -1;

                                                return (
                                                    <label
                                                        key={subcategory.id}
                                                        className="flex items-center gap-4 group cursor-pointer pl-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={isChecked}
                                                            onChange={() => onCheckboxClick(subcategory)}
                                                            aria-checked={isChecked}
                                                        />
                                                        <span
                                                            className={
                                                                `relative flex items-center justify-center w-4 h-4 rounded transition-colors duration-150 border ` +
                                                                (isChecked
                                                                    ? `bg-white border-transparent`
                                                                    : `bg-onBackground border-onBackgroundHover group-hover:bg-onBackgroundHover group-hover:border-onBackgroundHover`)
                                                            }
                                                            aria-hidden="true"
                                                        >
                                                                                                            {isChecked && (
                                                                                                                <svg
                                                                                                                    width="12"
                                                                                                                    height="12"
                                                                                                                    viewBox="0 0 24 24"
                                                                                                                    fill="none"
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    aria-hidden="true">
                                                                                                                    <path
                                                                                                                        d="M5 13l4 4L19 7"
                                                                                                                        stroke="black"
                                                                                                                        strokeWidth="2"
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"/>
                                                                                                                </svg>
                                                                                                            )}
                                                                                                        </span>
                                                        <p>{subcategory.name}</p>
                                                    </label>
                                                );
                                            })
                                    }
                                    <button
                                        type={"button"}
                                        className={"border-2 border-on-background bg-background hover:bg-on-background active:bg-on-background rounded-full flex pt-1 pb-1 pl-2 pr-2 justify-start items-center gap-3 w-fit"}
                                        onClick={() => onCreateSubcategoryPressedAction(category)}
                                    >
                                        <img src={"/ico/add.svg"} alt={"add"} className={"invert w-5"}/>
                                        <p>New subcategory</p>
                                    </button>
                                </motion.div>
                            }
                        </AnimatePresence>

                    </div>
                ))
            }
            <span className={"h-2"}></span>
            <Button iconName={"add"} text={"New category"} actionType={ActionTypeEnum.neutral} onClick={onCreateNewCategoryPressedAction}/>
        </div>
    );
}