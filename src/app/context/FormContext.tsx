"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from "react";
import Dialog from "@/app/components/overlays/Dialog";
import { useNotification } from "@/app/context/NotificationContext";
import {InsertableWebsite} from "@/app/models/Website";

export interface ChildFormProps<T> {
    setDataAction: (data: T) => void;
    initialValue?: T;
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
    const { showNotification } = useNotification();

    const openForm = <T,>(options: FormOptions<T>) => {
        setForm(options);
    };

    const closeForm = () => {
        setForm(null);
    };

    const submit = async () => {
        if (!form) return;
        if (!data) return;
        closeForm();

        try {
            await form.onSubmit(data);
            showNotification({
                title: form.successMsg || "Succès",
                iconSrc: "/illustrations/success.png"
            });
        } catch (error) {
            showNotification({
                title: form.errorMsg || "Une erreur s'est produite",
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
                    show={form !== null}
                    onCloseAction={closeForm}
                    onValidateAction={() => {}}
                    submitForValidation={true}
                >
                    {FormComponent && (
                        <FormComponent
                            initialValue={form?.initialValue}
                            setDataAction={setData}
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