"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import WebsiteService from "@/app/services/WebsiteService";


const isAdminContext = createContext<boolean | undefined>(undefined);

export function IsAdminProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const params = useParams();
    const websiteId = params?.websiteId as string | undefined;

    useEffect(() => {
        const verify = async () => {
            if (websiteId && user) {
                try {
                    const website = await WebsiteService.getWebsite(websiteId);
                    // On met à jour l'état ici
                    setIsAdmin(website.owner_id === user.id);
                } catch (error) {
                    console.error("Erreur lors de la vérification des droits :", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };

        verify();
    }, [user, websiteId]);

    return (
        <isAdminContext.Provider value={isAdmin}>
            {children}
        </isAdminContext.Provider>
    );
}

export function useIsAdmin() {
    const context = useContext(isAdminContext);
    // On vérifie strictement si le contexte est indéfini
    if (context === undefined) {
        throw new Error("useIsAdmin doit être utilisé à l'intérieur d'un IsAdminProvider");
    }
    return context;
}