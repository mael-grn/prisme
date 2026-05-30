'use client';

import { createContext, useContext, useEffect, useState, ReactNode, CSSProperties, useRef } from "react";
import { ImageUtil } from "@/app/utils/ImageUtil";
import CssUtil from "@/app/utils/CssUtil";

interface ThemeContextType {
    themeImage: string;
    themeStyles: CSSProperties;
    themeLoading: boolean;
    changeTheme: (imageUrl: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // 1. On initialise avec une chaîne vide pour détecter le rendu serveur
    const [themeImage, setThemeImage] = useState<string>("");
    const [themeStyles, setThemeStyles] = useState<CSSProperties>({});
    const [themeLoading, setThemeLoading] = useState<boolean>(true);
    const isInitialized = useRef(false);

    // Fonction pour changer le thème à la volée
    const changeTheme = async (imageUrl: string) => {
        setThemeLoading(true);
        try {
            // On applique l'image IMMÉDIATEMENT côté client pour éviter de rester bloqué sur l'état initial
            setThemeImage(imageUrl);

            const props = await CssUtil.getCSSPropertiesFromImage(imageUrl);
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
            setThemeLoading(false);
        }
    };

    // Initialisation unique au premier chargement au niveau du navigateur
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const initialImage = ImageUtil.getRandomBackgroundImage();
        changeTheme(initialImage);
    }, []);

    // 2. IMPORTANT : Si on est encore sur le serveur (themeImage vide),
    // on peut optionnellement retourner un loader ou attendre l'hydratation
    // pour éviter le flash blanc persistant sur Vercel.
    const currentThemeImage = themeImage || "/img/white.png";

    return (
        <ThemeContext.Provider value={{ themeImage: currentThemeImage, themeStyles, themeLoading, changeTheme }}>
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