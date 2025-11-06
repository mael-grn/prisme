import ParagraphClassiqueContainer from "@/app/components/paragrapheClassiqueContainer";
import TuileContainer from "@/app/components/tuileContainer";
import ParagraphDevContainer from "@/app/components/paragrapheDevContainer";
import {RecursiveSection} from "@/app/models/Section";
import {PossibleSectionType} from "@/app/enums/PossibleSectionType";

interface GroupedSections {
    type: PossibleSectionType;
    sections: RecursiveSection[];
}

export default function OrganizedSections({sections}: {sections: RecursiveSection[]}) {

    const groupedSections = groupSectionsByType(sections);

    function groupSectionsByType(sections: RecursiveSection[]): GroupedSections[] {
        const res : GroupedSections[] = [];

        for (const section of sections) {
            if (res[res.length - 1]?.type === section.section_type) {
                res[res.length - 1].sections.push(section);
            } else {
                res.push({
                    type: section.section_type as PossibleSectionType,
                    sections: [section]
                });
            }
        }

        return res;
    }

    return (
        <>
            {
                groupedSections.map((group, index) => {
                    switch (group.type) {
                        case PossibleSectionType.classic:
                            return <ParagraphClassiqueContainer sections={group.sections} key={index}/>;
                        case PossibleSectionType.tile:
                            return <TuileContainer sections={group.sections} key={index}/>;
                        case PossibleSectionType.develop:
                            return <ParagraphDevContainer sections={group.sections} key={index}/>;
                    }
                })
            }
        </>
    )
}