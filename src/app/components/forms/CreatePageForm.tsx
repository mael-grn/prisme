"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {useEffect, useState} from "react";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import {useTranslations} from "next-intl";
import {InsertablePage} from "@/app/models/Page";
import {pageSchema} from "@/app/schemas/PageSchema";

export default function CreatePageForm(props: ChildFormProps<InsertablePage>) {
    const t = useTranslations('fields-names');

    const [page, setPage] = useState<InsertablePage>(props.initialValue ? props.initialValue : {website_id: -1, path: "/", title: ""})

    const editWebsiteData = (website: InsertablePage) => {
        setPage(website);
        checkData(website)
        props.setDataAction(website);
    }

    const checkData = (data?: InsertablePage) => {
        if (!data) {
            props.setDataValidAction(false);
        }
        const res = pageSchema.safeParse(data);
        props.setDataValidAction(res.success);
    }

    useEffect(() => {
        checkData(props.initialValue);
    }, [props.initialValue, props.setDataValidAction]);

    const onPageNameChange = (s: string) => {
        editWebsiteData({
            path: "/" + StringUtil.nettoyerTexte(page.title) == page.path ? "/" + StringUtil.nettoyerTexte(s) : page.path,
            title: s,
            website_id: page.website_id
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <Input placeHolder={t('websiteTitle')} onChangeAction={onPageNameChange} validatorAction={StringUtil.basicStringValidator} value={page.title} />
            <Input placeHolder={t('pagePath')} onChangeAction={(s) => editWebsiteData({...page, path: s})} validatorAction={StringUtil.pathStringValidator} value={page.path} />
        </div>
    );
}