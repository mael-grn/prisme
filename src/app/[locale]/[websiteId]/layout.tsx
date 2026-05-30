"use client"

import {useUser} from "@/app/context/UserContext";
import {useTheme} from "@/app/context/ThemeContext";
import {useParams, usePathname} from "next/navigation";
import Background from "@/app/components/page-elements/Background";
import {useEffect} from "react";
import useSWR from "swr";
import WebsiteService from "@/app/services/WebsiteService";


export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {

    //const t = useTranslations('main-website');
    const {websiteId} = useParams();
    const fetcher = async () => await WebsiteService.getWebsite(websiteId as string);
    const pathname = usePathname();
    const { user, userLoading } = useUser();
    const { themeStyles, changeTheme } = useTheme();
    const {data: website, error, isLoading, mutate} = useSWR('website', fetcher);

    useEffect(() => {
        console.log(website)
        if (website && website.image_src) {
            changeTheme(website.image_src)
        }
    }, [website]);

    return <>
        <Background/>
        <main style={themeStyles}>

        </main>
    </>
}