"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {InsertableWebsite} from "@/app/models/Website";
import {useState} from "react";
import {useUser} from "@/app/context/UserContext";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";

export default function WebsiteForm({ setDataAction, initialValue }: ChildFormProps<InsertableWebsite>) {
    const {user} = useUser();
    const [website, setWebsite] = useState<InsertableWebsite>(initialValue ? initialValue : {owner_id: user?.id || -1, title: "", website_domain: undefined, lang: undefined, image_src: undefined})

    const editWebsiteData = (website: InsertableWebsite) => {
        setWebsite(website);
        setDataAction(website);
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Input placeHolder={"title"} onChangeAction={(s) => editWebsiteData({...website, title: s})} validatorAction={StringUtil.basicStringValidator} value={website.title} />
            </div>
        </div>
    );
}