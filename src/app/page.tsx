"use client";

import {motion} from "framer-motion";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";

export default function Page() {

    // Valeurs d'animation
    const animateValues = {
        y: [0, -40, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
    };

    // L'ajout de "as const" sur repeatType et ease est OBLIGATOIRE pour TypeScript
    const getTransition = (duration: number) => ({
        duration: duration,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut" as const,
    });

    return (
        <main className="relative w-full h-screen overflow-hidden bg-background text-foreground flex flex-col items-center justify-center gap-3">

            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">

                {/* Rouge/Orange */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(8)}
                    className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[120%] bg-orange-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

                {/* Jaune/Vert */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(10)}
                    className="absolute bottom-[-10%] left-[20%] w-[30%] h-[120%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
                />

                {/* Cyan/Bleu Ciel */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(7)}
                    className="absolute bottom-[-10%] left-[40%] w-[30%] h-[120%] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

                {/* Indigo/Bleu Profond */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(9)}
                    className="absolute bottom-[-10%] right-[20%] w-[30%] h-[120%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[110px] opacity-40"
                />

                {/* Violet/Magenta */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(11)}
                    className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[120%] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

            </div>

            <div className="z-10 flex flex-col items-center justify-center gap-8 relative">
                <img
                    src={"/img/icon.png"}
                    alt={"icon"}
                    className={"md:w-52 w-24 h-fit"}
                />
                <h1 className={"text-center md:text-7xl font-array text-4xl font-bold tracking-tight"}>
                    Refract Your Vision <br/> Into Reality
                </h1>
                <p className={"text-center text-lg font-chillax max-w-5xl"}>
                    Create, edit and manage your websites in realtime, effortlessly. This is
                    our vision : Prisme.
                </p>

                <Button text={"Get started"} actionType={ActionTypeEnum.neutral} iconName={"arrow-up-right"}/>

            </div>
        </main>
    );
}