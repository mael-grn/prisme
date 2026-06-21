"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {InsertableWebsite, Website} from "@/app/models/Website";
import {useEffect, useState} from "react";
import {useUser} from "@/app/context/UserContext";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import {useTranslations} from "next-intl";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";
import ImageInput from "@/app/components/forms-inputs/imageInput";
import ImageInputUploader from "@/app/components/forms-inputs/ImageInputUploader";

export default function EditWebsiteForm(props: ChildFormProps<Website>) {
    const {user} = useUser();
    const t = useTranslations('fields-names');

    const [website, setWebsite] = useState<Website>(props.initialValue ? props.initialValue : {id:-1, owner_id: user?.id || -1, title: "", website_domain: undefined, lang: undefined, image_src: undefined})

    const editWebsiteData = (data: Website) => {
        setWebsite(data);
        checkWebsiteData(data)
        props.setDataAction(data);
    }

    const checkWebsiteData = (website?: Website) => {
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