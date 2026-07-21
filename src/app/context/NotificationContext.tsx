"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '@/app/components/overlays/Notification'; // Ton composant actuel

// 1. On définit ce qu'on peut passer à notre notification
export interface NotificationOptions {
    title: string;
    description?: string;
    iconSrc?: string;
}

// 2. On définit les fonctions disponibles dans notre Hook
interface NotificationContextType {
    showNotification: (options: NotificationOptions) => void;
    hideNotification: () => void;
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 3. Le Provider qui va englober l'application
export function NotificationProvider({ children }: { children: ReactNode }) {
    // L'état centralisé de la notification
    const [notification, setNotification] = useState<NotificationOptions | null>(null);

    const showNotification = (options: NotificationOptions) => {
        setNotification(options);
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}

            {/* On place ton composant Notification ICI, à la racine */}
            {/* Il sera invisible tant que "notification" est null */}
            <Notification
                show={notification !== null}
                onCloseAction={hideNotification}
                title={notification?.title || "Notification"}
                description={notification?.description}
                iconSrc={notification?.iconSrc}
            />
        </NotificationContext.Provider>
    );
}

// 4. Le Hook personnalisé prêt à l'emploi
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification doit être utilisé à l'intérieur d'un NotificationProvider");
    }
    return context;
};