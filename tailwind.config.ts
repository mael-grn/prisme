import type {Config} from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                backgroundOpacity: "rgba(0, 0, 0, 0.75)",
                onBackground: "#121212",
                onBackgroundHover: "#2c2c2c",
                foreground: "#ffffff",
                onForeground: "#cfcfcf",
                onForegroundHover: "#bfbfbf",
                dangerous: "#c53854",
                dangerousHover: "#A91D3A",
                safe: "#5ca6b3",
                safeHover: "#2F7C8A",
                primary: "#5ca6b3",
                primaryHover: "#2F7C8A",
            },
        },
    },
    plugins: [],
} satisfies Config;