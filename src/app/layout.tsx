import type { Metadata } from "next";
import "./globals.css";
import {arrayFont, chillaxFont, clashDisplayFont, exconFont, satoshiFont, stardomFont} from "@/app/fonts";


export const metadata: Metadata = {
  title: "Prisme",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`
          ${arrayFont.variable} 
          ${satoshiFont.variable} 
          ${chillaxFont.variable} 
          ${clashDisplayFont.variable} 
          ${exconFont.variable} 
          ${stardomFont.variable} 
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
