"use client";

import React, { createContext, useContext, useState, ReactNode} from "react";
import Dialog from "@/app/components/overlays/Dialog";
import { useNotification } from "@/app/context/NotificationContext";
import {useTranslations} from "next-intl";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";

export interface ChildFormProps<T> {
    setDataAction: (data: T) => void;
    initialValue?: T;
    setDataValidAction: (valid: boolean) => void;
}

export interface FormOptions<T> {
    title: string;
    description?: string;
    iconSrc?: string;
    form: React.ComponentType<ChildFormProps<T>>;
    onSubmit: (data: T) => Promise<T>;
    successMsg?: string;
    errorMsg?: string;
    initialValue?: T;
}

interface FormDialogContextType {
    openForm: <T>(options: FormOptions<T>) => void;
    closeForm: () => void;
}

const FormDialogContext = createContext<FormDialogContextType | undefined>(undefined);

export function FormDialogProvider({ children }: { children: ReactNode }) {
    const [form, setForm] = useState<FormOptions<any> | null>(null);
    const [data, setData] = useState(null);
    const [dataIsValid, setDataIsValid] = useState(false);
    const t = useTranslations('form');

    const { showNotification } = useNotification();

    const openForm = <T,>(options: FormOptions<T>) => {
        setForm(options);
    };

    const closeForm = () => {
        setForm(null);
    };

    const submit = async () => {
        console.log("submit", form);
        if (!form) return;
        console.log("data", data);
        if (!data) return;
        console.log("valid", dataIsValid);
        if (!dataIsValid) return;
        closeForm();

        try {
            await form.onSubmit(data);
            showNotification({
                title: form.successMsg || t('defaultSuccessMessage'),
                iconSrc: "/illustrations/check.png"
            });
        } catch (error) {
            showNotification({
                title: form.errorMsg || t('defaultErrorMessage'),
                iconSrc: "/illustrations/error.png"
            });
        }
    };

    const FormComponent = form?.form;

    return (
        <FormDialogContext.Provider value={{ openForm, closeForm }}>
            {children}
            <form onSubmit={(e) => {
                e.preventDefault();
                submit()
            }}>
                <Dialog
                    title={form?.title || "Formulaire"}
                    description={form?.description || undefined}
                    show={form !== null}
                    onCloseAction={closeForm}
                    onValidateAction={() => {
                    }}
                    submitForValidation={true}
                    disableValidate={!dataIsValid}
                >
                    {FormComponent && (
                        <FormComponent
                            initialValue={form?.initialValue}
                            setDataAction={setData}
                            setDataValidAction={setDataIsValid}
                        />
                    )}
                </Dialog>
            </form>
        </FormDialogContext.Provider>
    );
}

export function useFormDialog() {
    const context = useContext(FormDialogContext);
    if (!context) throw new Error("useFormDialog doit être utilisé à l'intérieur de FormDialogProvider");
    return context;
}