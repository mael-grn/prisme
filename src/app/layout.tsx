import type { Metadata } from "next";
import "./globals.css";
import {
    arrayFont,
    boskaFont,
    chillaxFont,
    clashDisplayFont, outfitFont,
    satoshiFont,
} from "@/app/fonts";


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
          ${outfitFont.variable} 
          ${boskaFont.variable} 
          antialiased
          bg-background
        `}
      >
        {children}
      </body>
    </html>
  );
}
