"use client";

import Toggle from "@/app/components/toggle";
import WebsiteService from "@/app/services/websiteService";
import {useEffect, useState} from "react";

export default function Footer() {

    const [cacheEnabled, setCacheEnabled] = useState(true);

    useEffect(() => {
        setCacheEnabled(WebsiteService.isCacheActive());
    }, [])

    function toggleCache(v: boolean) {
        setCacheEnabled(v);
        if (v) {
            WebsiteService.enable_cache();
        } else {
            WebsiteService.disable_cache();
        }
    }
    return (
        <footer className={"w-full bg-black text-white flex flex-col"}>

            <div className={"w-full h-fit md:h-52  p-4 md:p-8 flex md:flex-row flex-col md:justify-between md:gap-6 gap-4"}>
                <img src={"/img/icon.png"} alt={"icon"} className={"md:h-full h-32 w-fit rounded-lg"} />

                <div className={"flex flex-col gap-2"}>
                    <h3>Prisme</h3>
                    <p>Nom non déposé, servant uniquement de nom de code pour le projet.</p>
                    <p>Application non commercialisée ni monétisée</p>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <h3>Crédits</h3>
                    <p>Icones utilisées : <a className={"text-blue-600 hover:underline"} href={"https://heroicons.com/"} target={"_blank"}>Heroicons</a> (Lience MIT).</p>
                    <p>Illustrations utilisées : <a className={"text-blue-600 hover:underline"} href={"https://undraw.co/"}>Undraw</a>.</p>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <h3>Paramètres</h3>
                    <div className={"flex gap-4 items-center"}>
                        <p>Utilisation du cache : </p>
                        <Toggle checked={cacheEnabled} onChangeAction={toggleCache} />
                    </div>
                </div>
            </div>

            <p className={"text-gray-500 p-4 w-full text-center"}>
                © 2025 Maël Garnier, tous droits réservés.
            </p>

        </footer>
    )
}