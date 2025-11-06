"use client"

import "../globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import {useParams} from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const {websiteId} = useParams()
    return (
    <>
        <div className={"pt-24 md:pt-24 md:p-3 p-6"}>
            {children}

        </div>
        <Navbar websiteIdOrDomain={websiteId as string}/>
        <Footer/>
    </>
  );
}
