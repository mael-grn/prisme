export interface WebsiteColors {
    primary: string;
    primary_variant: string;
    secondary: string;
    secondary_variant: string;
    background: string;
    background_variant: string;
    foreground: string;
    foreground_variant: string;
}

export const getDefaultColors = () : WebsiteColors => {
    return {
        primary: "#8a8a8a",
        primary_variant: "#6c6c6c",
        secondary: "#8a8a8a",
        secondary_variant: "#6c6c6c",
        background: "#ffffff",
        background_variant: "#cfcfcf",
        foreground: "#000000",
        foreground_variant: "#1e1e1e",
    }
}

