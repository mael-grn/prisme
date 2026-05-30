'use client';

import { ChangeEvent, DragEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {useTranslations} from "next-intl";

export interface ImageInputProps {
    setFileAction: (file: File) => void;
    error?: string;
    initialValue?: string;
    className?: string;
}

export default function ImageInput({ setFileAction, initialValue, error, className = '' }: ImageInputProps) {
    const [newFile, setNewFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(initialValue ? initialValue : null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const t = useTranslations('form')

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    };

    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setFileAction(file);
            setNewFile(file);
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setFileAction(file);
            setNewFile(file);
            setImageSrc(URL.createObjectURL(file));
        }
    };

    return (
        <div className={`flex flex-col gap-2 w-full max-w-sm ${className}`}>
            <motion.label
                htmlFor="file-input"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: isDragging ? 1.02 : 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    opacity: { duration: 0.2 }
                }}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    p-6
                    backdrop-blur-xl
                    border
                    transition-colors duration-300
                    shadow-xl shadow-black/10 shadow-inner
                    cursor-pointer
                    min-h-[140px]
                    flex flex-col items-center justify-center
                    ${error
                    ? 'bg-dangerous/20 border-dangerous/40'
                    : isDragging
                        ? 'bg-background/80 border-white/40 bg-gradient-to-br from-white/20 via-white/10 to-transparent'
                        : 'bg-background/60 border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent'
                }
                `}
            >
                <div
                    className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/10 to-transparent"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                    }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-foreground gap-2">
                    {newFile ? (
                        <>
                            <img
                                src={imageSrc || ""}
                                alt="preview"
                                className="h-16 w-auto object-cover rounded-lg shadow-md"
                            />
                            <p className="text-sm text-center truncate w-full px-2">{newFile.name}</p>
                        </>
                    ) : (
                        <>
                            <img
                                className=" w-20 h-20 opacity-80"
                                src="/illustrations/photo.png"
                                alt="cloud"
                            />
                            <p className="text-sm text-muted-foreground text-center">
                                {t('imageUpload')}
                            </p>
                        </>
                    )}
                </div>
            </motion.label>

            <input
                className="hidden"
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept="image/*"
            />

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm text-dangerous px-2"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}