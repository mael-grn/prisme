"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Dialog from "@/app/components/overlays/Dialog";

export interface DialogOptions {
    title: string;
    description?: string;
    iconSrc?: string;
    onValidateAction?: () => void;
    triggerId?: string;
}

interface DialogContextType {
    showDialog: (options: DialogOptions) => void;
    hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogOptions | null>(null);

    const showDialog = (options: DialogOptions) => {
        setDialog(options);
    };

    const hideDialog = () => {
        setDialog(null);
    };

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            {children}
            <Dialog
                show={dialog !== null}
                onCloseAction={hideDialog}
                title={dialog?.title || "Notification"}
                description={dialog?.description}
                iconSrc={dialog?.iconSrc}
                triggerId={dialog?.triggerId}
                onValidateAction={ () => {
                    dialog?.onValidateAction?.();
                    hideDialog();
                }}
            />
        </DialogContext.Provider>
    );
}

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog doit être utilisé à l'intérieur d'un DialogProvider");
    }
    return context;
};