"use client";

import { useTheme } from "@/app/context/ThemeContext";
import Image from "next/image";

export default function Background({zoom}: {zoom?: boolean}) {
    const { themeImage, themeLoading } = useTheme();

    return (
        <div className="fixed top-0 left-0 -z-1 w-screen h-screen bg-neutral-950 overflow-hidden">

            {/* 1. L'IMAGE DE FOND */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${themeLoading ? "opacity-0" : "opacity-100"}`}>
                <Image
                    src={themeImage}
                    alt="background"
                    fill
                    className={`transition-all duration-700 object-cover ${zoom ? "scale-125" : "scale-100"}`}
                    sizes="100vw"
                    priority
                />
            </div>

            {/* 2. LE FONDS ANIMÉ ULTRA-DYNAMIQUE (Zéro Lottie, Zéro CPU) */}
            {themeLoading && (
                <div className="absolute inset-0 bg-neutral-950 overflow-hidden flex items-center justify-center">

                    {/* Injecte les keyframes directement pour éviter de toucher au config Tailwind */}
                    <style>{`
                        @keyframes float-slow {
                            0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
                            33% { transform: translate(100px, -80px) scale(1.2) rotate(120deg); }
                            66% { transform: translate(-60px, 40px) scale(0.8) rotate(240deg); }
                            100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
                        }
                        @keyframes float-reverse {
                            0% { transform: translate(0px, 0px) scale(1.2) rotate(360deg); }
                            50% { transform: translate(-120px, 60px) scale(0.9) rotate(180deg); }
                            100% { transform: translate(0px, 0px) scale(1.2) rotate(0deg); }
                        }
                        .animate-float-1 { animation: float-slow 15s infinite alternate ease-in-out; }
                        .animate-float-2 { animation: float-reverse 12s infinite alternate ease-in-out; }
                        .animate-float-3 { animation: float-slow 18s infinite reverse ease-in-out; }
                    `}</style>

                    {/* Bulle 1 : Violet / Rose Cyan */}
                    <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 opacity-40 blur-[130px] top-[-10%] left-[-10%] animate-float-1" />

                    {/* Bulle 2 : Bleu Électrique / Indigo */}
                    <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-500 opacity-30 blur-[150px] bottom-[-20%] right-[-10%] animate-float-2" />

                    {/* Bulle 3 : Émeraude / Turquoise (Le boost de couleur dynamique au centre) */}
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur-[120px] top-[30%] left-[25%] animate-float-3" />
                </div>
            )}
        </div>
    );
}