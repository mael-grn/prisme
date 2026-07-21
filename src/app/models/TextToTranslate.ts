export interface TextToTranslate {
    text: string;
    source?: Language | undefined;
    target: Language;
}

export enum Language {
    ENGLISH = "en",
    FRENCH = "fr",
    SPANISH = "es",
    GERMAN = "de",
    ITALIAN = "it",
}