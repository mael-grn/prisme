import type { Metadata } from "next";
import "../globals.css";
import { Montserrat } from "next/font/google";
import {routing} from "../../i18n/routing";
import {notFound} from "next/navigation";
import {getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import {UserProvider} from "@/app/context/UserContext";
import {ThemeProvider} from "@/app/context/ThemeContext";
import {NotificationProvider} from "@/app/context/NotificationContext";
import {DialogProvider} from "@/app/context/DialogContext";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Panorama",
  description: "",
};

/**
 * Standard root layout. All used fonts are loaded here
 * @param children
 * @constructor
 */
export default async function RootLayout({
  children,
    params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }
    const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
          className={`
          ${montserrat.className} 
          antialiased
          bg-background
        `}
      >
      <NextIntlClientProvider messages={messages}>
          <DialogProvider>
              <NotificationProvider>
                  <UserProvider>
                      <ThemeProvider>
                          {children}
                      </ThemeProvider>
                  </UserProvider>
              </NotificationProvider>
          </DialogProvider>
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
