import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Serac",
  description: "",
};

/**
 * Standard root layout. All used fonts are loaded here
 * @param children
 * @constructor
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`
          ${montserrat.className} 
          antialiased
          bg-background
        `}
      >
        {children}
      </body>
    </html>
  );
}
