"use client"

import "../globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {useParams} from "next/navigation";
import {CSSProperties, useEffect, useState} from "react";
import CssUtil from "@/app/utils/CssUtil";
import WebsiteService from "@/app/services/WebsiteService";

/**
 * Layout pour toute page du site.
 * Applique les couleurs spécifiées par l'utilisateur pour le site, et affiche la navbar et le footer.
 * @param children
 * @constructor
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [cssProps, setCssProps] = useState<CSSProperties>()

    const { websiteId } = useParams();

    /**
     * On récupère les propriétés CSS du site depuis la base de données, notamment les couleurs qui sont spécifiés par l'utilisateur, et on les applique à la page grâce à un style en ligne.
     */
    useEffect(() => {
        if (websiteId) {
            WebsiteService.getCSSPropertiesForWebsite(websiteId as string).then(setCssProps);
        }
    }, [websiteId]);

    return (
        <div style={cssProps} className="min-h-screen bg-background text-foreground">
            <div className="md:p-24 p-12">
                {children}
            </div>
            <Navbar websiteIdOrDomain={websiteId as string}/>
            <Footer/>
        </div>
    );
}
