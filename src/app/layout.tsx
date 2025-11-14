"use client";
import "./globals.css";
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
    <html lang="en">
      <body
      >
        {children}
        <Navbar websiteIdOrDomain={websiteId as string}/>
        <Footer/>
      </body>
    </html>
  );
}
