"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {InsertableWebsite, Website} from "@/app/models/Website";
import {useEffect, useState} from "react";
import {useUser} from "@/app/context/UserContext";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import {useTranslations} from "next-intl";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";

export default function EditWebsiteForm({ setDataAction, initialValue, setDataValidAction }: ChildFormProps<Website>) {
    const {user} = useUser();
    const t = useTranslations('fields-names');

    const [website, setWebsite] = useState<Website>(initialValue ? initialValue : {id:-1, owner_id: user?.id || -1, title: "", website_domain: undefined, lang: undefined, image_src: undefined})

    const editWebsiteData = (website: Website) => {
        setWebsite(website);
        checkWebsiteData(website)
        setDataAction(website);
    }

    const checkWebsiteData = (website?: Website) => {
        if (!website) {
            setDataValidAction(false);
        }
        console.log(website);
        const res = websiteSchema.safeParse(website);
        setDataValidAction(res.success);
        console.log(res);
    }

    useEffect(() => {
        checkWebsiteData(initialValue);
    }, [initialValue, setDataValidAction]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Input placeHolder={t('websiteTitle')} onChangeAction={(s) => editWebsiteData({...website, title: s})} validatorAction={StringUtil.basicStringValidator} value={website.title} />
            </div>
        </div>
    );
}