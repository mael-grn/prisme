"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '@/app/components/overlays/Notification';
import Dialog from "@/app/components/overlays/Dialog"; // Ton composant actuel

// 1. On définit ce qu'on peut passer à notre notification
export interface DialogOptions {
    title: string;
    description?: string;
    iconSrc?: string;
    onValidateAction?: () => void;
}

// 2. On définit les fonctions disponibles dans notre Hook
interface DialogContextType {
    showDialog: (options: DialogOptions) => void;
    hideDialog: () => void;
}

// Création du contexte
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// 3. Le Provider qui va englober l'application
export function DialogProvider({ children }: { children: ReactNode }) {
    // L'état centralisé de la notification
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

            {/* On place ton composant Notification ICI, à la racine */}
            {/* Il sera invisible tant que "notification" est null */}
            <Dialog
                show={dialog !== null}
                onCloseAction={hideDialog}
                title={dialog?.title || "Notification"}
                description={dialog?.description}
                iconSrc={dialog?.iconSrc}
                onValidateAction={ () => {
                    dialog?.onValidateAction?.();
                    hideDialog();
                }}
            />
        </DialogContext.Provider>
    );
}

// 4. Le Hook personnalisé prêt à l'emploi
export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog doit être utilisé à l'intérieur d'un DialogProvider");
    }
    return context;
};