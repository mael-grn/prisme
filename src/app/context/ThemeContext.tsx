"use client";

import { createContext, useContext, useEffect, useState, ReactNode, CSSProperties } from "react";
import { ImageUtil } from "@/app/utils/ImageUtil";
import CssUtil from "@/app/utils/CssUtil";

interface ThemeContextType {
    themeImage: string;
    themeStyles: CSSProperties;
    changeTheme: (imageUrl: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeImage, setThemeImage] = useState<string>("/img/white.png");
    const [themeStyles, setThemeStyles] = useState<CSSProperties>({});

    // Fonction pour changer le thème à la volée depuis n'importe quel composant
    const changeTheme = async (imageUrl: string) => {
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
        }
    };

    // Initialisation unique au premier chargement (F5)
    useEffect(() => {
        const initialImage = ImageUtil.getRandomBackgroundImage();
        changeTheme(initialImage);
    }, []);

    return (
        <ThemeContext.Provider value={{ themeImage, themeStyles, changeTheme }}>
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