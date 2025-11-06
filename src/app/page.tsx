"use client"

import Button, {ActionTypeEnum} from "@/app/components/Button";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter()
    return <main className="w-full h-screen overflow-hidden flex flex-col items-center justify-center gap-3">
        <img src={"/img/icon.png"} alt={"icon"} className={"w-36 h-fit"}/>
        <h1>Bienvenue sur Prisme !</h1>
        <p className={"text-center"}>Créez facilement des sites internet, rendez les accessible et gérez leurs contenus en temps réel !</p>
        <Button actionType={ActionTypeEnum.safe} iconName={"arrow-out-outline"} text={"Commencer à créer"} onClick={() => router.push("https://prismadmin.maelg.fr")} />
    </main>
}