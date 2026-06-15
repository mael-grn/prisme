"use client";

import {ChildFormProps} from "@/app/context/FormContext";
import {InsertableWebsite} from "@/app/models/Website";
import {useEffect, useState} from "react";
import {useUser} from "@/app/context/UserContext";
import Input from "@/app/components/forms-inputs/Input";
import StringUtil from "@/app/utils/StringUtil";
import {useTranslations} from "next-intl";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";
import {InsertablePage} from "@/app/models/Page";
import {pageSchema} from "@/app/schemas/PageSchema";

export default function CreatePageForm({ setDataAction, initialValue, setDataValidAction }: ChildFormProps<InsertablePage>) {
    const {user} = useUser();
    const t = useTranslations('fields-names');

    const [page, setPage] = useState<InsertablePage>(initialValue ? initialValue : {website_id: -1, path: "/", title: ""})

    const editWebsiteData = (website: InsertablePage) => {
        setPage(website);
        checkData(website)
        setDataAction(website);
    }

    const checkData = (data?: InsertablePage) => {
        if (!data) {
            setDataValidAction(false);
        }
        const res = pageSchema.safeParse(data);
        setDataValidAction(res.success);
    }

    useEffect(() => {
        checkData(initialValue);
    }, [initialValue, setDataValidAction]);

    return (
        <div className="flex flex-col gap-4">
            <Input placeHolder={t('websiteTitle')} onChangeAction={(s) => editWebsiteData(StringUtil.nettoyerTexte(page.path).slice(1) === page.path ? {...page, path: '/' + StringUtil.nettoyerTexte(s), title: s} : {...page, title: s})} validatorAction={StringUtil.basicStringValidator} value={page.title} />
            <Input placeHolder={t('pagePath')} onChangeAction={(s) => editWebsiteData({...page, path: s})} validatorAction={StringUtil.pathStringValidator} value={page.path} />
        </div>
    );
}