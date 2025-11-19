"use client"

import "../globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import {useParams} from "next/navigation";
import {CSSProperties, useEffect, useState} from "react";
import CssUtil from "@/app/utils/cssUtil";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [cssProps, setCssProps] = useState<CSSProperties>()

    useEffect(() => {
        CssUtil.getCSSPropertiesForWebsite(websiteId as string).then((props) => {
            setCssProps(props)
        });
    }, [])

    const {websiteId} = useParams()
    return (
    <>
        <div
            style={cssProps}
            className={"min-h-screen bg-background text-foreground"}>
            {children}

        </div>
        <Navbar websiteIdOrDomain={websiteId as string}/>
        <Footer/>
    </>
  );
}
