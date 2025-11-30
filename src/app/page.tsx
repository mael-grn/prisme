"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {

    // 1. Les valeurs d'animation (ce qui change)
    const animateValues = {
        y: [0, -40, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
    };

    // 2. La configuration du temps
    // L'ajout de "as const" sur repeatType et ease est OBLIGATOIRE pour TypeScript
    const getTransition = (duration: number) => ({
        duration: duration,
        repeat: Infinity,
        repeatType: "mirror" as const, // <--- Fixe l'erreur de type
        ease: "easeInOut" as const,    // <--- Fixe l'erreur "string is not assignable to Easing"
    });

    return (
        <main className="relative w-full h-screen overflow-hidden bg-background text-foreground flex flex-col items-center justify-center gap-3">

            {/* --- DÉBUT DE L'EFFET PRISME VIVANT --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">

                {/* 1. Rouge/Orange */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(8)}
                    className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[120%] bg-orange-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

                {/* 2. Jaune/Vert */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(10)}
                    className="absolute bottom-[-10%] left-[20%] w-[30%] h-[120%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
                />

                {/* 3. Cyan/Bleu Ciel */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(7)}
                    className="absolute bottom-[-10%] left-[40%] w-[30%] h-[120%] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

                {/* 4. Indigo/Bleu Profond */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(9)}
                    className="absolute bottom-[-10%] right-[20%] w-[30%] h-[120%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[110px] opacity-40"
                />

                {/* 5. Violet/Magenta */}
                <motion.div
                    animate={animateValues}
                    transition={getTransition(11)}
                    className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[120%] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
                />

            </div>
            {/* --- FIN DE L'EFFET PRISME --- */}

            <div className="z-10 flex flex-col items-center justify-center gap-3 relative">
                <img
                    src={"/img/icon.png"}
                    alt={"icon"}
                    className={"md:w-52 w-24 h-fit"}
                />
                <h1 className={"text-center md:text-[75px] text-[30px] font-bold tracking-tight"}>
                    Refract Your Vision <br/> Into Reality
                </h1>
                <p className={"text-center text-sm mt-8 mb-20 max-w-2xl"}>
                    Create, edit and manage your websites in realtime, effortlessly. This is
                    our vision : Prisme.
                </p>

                <Link
                    href={"https://prismadmin.maelg.fr"}
                    target={"_blank"}
                    className={"flex items-center justify-center gap-3 text-xl px-6 py-3 bg-backgroundOpacity rounded-full transition hover:scale-105 hover:bg-backgroundOpacityStrong border border-foregroundOpacity hover:border-foregroundOpacityStrong"}
                >
                    Get started
                    <img src={"ico/rocket.svg"} alt={"rocket"} className={"invert w-6"}/>
                </Link>

            </div>
        </main>
    );
}