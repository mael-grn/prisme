"use client"

import {useUser} from "@/app/context/UserContext";
import {useTheme} from "@/app/context/ThemeContext";
import {useParams, usePathname} from "next/navigation";
import Background from "@/app/components/page-elements/Background";
import {useEffect, useState, UIEvent} from "react";
import useSWR from "swr";
import WebsiteService from "@/app/services/WebsiteService";
import Container from "@/app/components/page-elements/Container";
import NavBar from "../../components/page-elements/NavBar";

type SizeType = "reduced" | "full"

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {

    const {websiteId} = useParams();
    const fetcher = async () => await WebsiteService.getWebsite(websiteId as string);
    const {themeStyles, changeTheme, changeThemeRandom} = useTheme();
    const {data: website, error, isLoading, mutate} = useSWR('website', fetcher);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (website && website.image_src) {
                changeTheme(website.image_src)
            } else {
                changeThemeRandom();
            }
        }
    }, [website]);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (scrollTop > 15) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const sizeClasses = {
        reduced: "h-[83%] w-10/12 max-w-10/12 rounded-3xl",
        full: "h-full w-full max-w-full rounded-none"
    };

    return <>
        <Background zoom={scrolled}/>
        <main className={`w-full h-screen fixed top-0 left-0 flex justify-center items-end overflow-hidden`}
              style={themeStyles}>
            <Container
                flatBottom={true}
                onScroll={handleScroll}
                className={`transition-all duration-500 ease-out overflow-y-auto overflow-x-hidden ${scrolled ? sizeClasses.full : sizeClasses.reduced}`}
            >
                {/* Ce wrapper garantit que même s'il y a peu de contenu,
                  la zone scrollable fait au moins la hauteur de l'écran + 50px.
                  Ainsi, le scroll ne disparaît jamais brutalement lors de l'agrandissement.
                */}
                <div className="min-h-[calc(100vh+50px)] w-full">
                    {children}
                </div>
            </Container>
        </main>
        {
            website && <NavBar websiteId={website?.id} scrolled={scrolled}/>
        }
    </>
}