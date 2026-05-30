"use client";

import { createContext, useContext, useEffect, useState, ReactNode, CSSProperties } from "react";
import { ImageUtil } from "@/app/utils/ImageUtil";
import CssUtil from "@/app/utils/CssUtil";

interface ThemeContextType {
    themeImage: string;
    themeStyles: CSSProperties;
    themeLoading: boolean; // Ajout du type
    changeTheme: (imageUrl: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeImage, setThemeImage] = useState<string>("/img/white.png");
    const [themeStyles, setThemeStyles] = useState<CSSProperties>({});
    const [themeLoading, setThemeLoading] = useState<boolean>(true); // Ajout du state initialisé à true

    // Fonction pour changer le thème à la volée depuis n'importe quel composant
    const changeTheme = async (imageUrl: string) => {
        setThemeLoading(true); // On repasse à true si on change de thème en cours de route
        try {
            const props = await CssUtil.getCSSPropertiesFromImage(imageUrl);
            setThemeImage(imageUrl);
            setThemeStyles(props);
            const root = document.documentElement;
            Object.entries(props).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    root.style.setProperty(key, value);
                }
            });
        } catch (error) {
            console.error("Erreur lors du calcul du CSS de l'image :", error);
        } finally {
            setThemeLoading(false); // Le chargement est terminé (succès ou erreur)
        }
    };

    // Initialisation unique au premier chargement (F5)
    useEffect(() => {
        const initialImage = ImageUtil.getRandomBackgroundImage();
        changeTheme(initialImage);
    }, []);

    return (
        // Injection de themeLoading dans le Provider
        <ThemeContext.Provider value={{ themeImage, themeStyles, themeLoading, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
    }
    return context;
}