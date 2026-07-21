"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {InsertableWebsite} from "@/app/models/Website";
import {useEffect, useState} from "react";
import {useUser} from "@/app/context/UserContext";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import {useTranslations} from "next-intl";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";
import ImageInputUploader from "@/app/components/forms-inputs/ImageInputUploader";

export default function CreateWebsiteForm(props: ChildFormProps<InsertableWebsite>) {
    const {user} = useUser();
    const t = useTranslations('fields-names');

    const [website, setWebsite] = useState<InsertableWebsite>(props.initialValue ? props.initialValue : {owner_id: user?.id || -1, title: "", website_domain: undefined, lang: undefined, image_src: undefined})

    const editWebsiteData = (website: InsertableWebsite) => {
        setWebsite(website);
        checkWebsiteData(website)
        props.setDataAction(website);
    }

    const checkWebsiteData = (website?: InsertableWebsite) => {
        if (!website) {
            props.setDataValidAction(false);
        }
        const res = websiteSchema.safeParse(website);
        props.setDataValidAction(res.success);
    }

    useEffect(() => {
        checkWebsiteData(props.initialValue);
    }, [props.initialValue, props.setDataValidAction]);

    return (
        <div className="flex flex-col gap-4">
            <Input placeHolder={t('websiteTitle')} onChangeAction={(s) => editWebsiteData({...website, title: s})} validatorAction={StringUtil.basicStringValidator} value={website.title} />
            <ImageInputUploader initialImage={website.image_src} setLinkAction={(s) => editWebsiteData({...website, image_src: s})}/>
        </div>
    );
}