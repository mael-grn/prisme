"use client"

import "../globals.css";
import Footer from "@/app/components/page-elements/Footer";
import EditorNavbar from "@/app/components/page-elements/EditorNavbar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
            <div className="min-h-screen bg-background font-chillax text-foreground ">
                <EditorNavbar/>
                {children}
                <Footer/>
            </div>
        </div>
    );
}
