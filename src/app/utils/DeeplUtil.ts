'use server'

import {Language} from "@/app/models/TextToTranslate";

export async function deeplTranslate(text: string, targetLang: Language): Promise<string> {
    const apiKey = process.env.DEPPL_API_KEY;
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: 'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'User-Agent': 'Prisme/1.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: [text],
            target_lang: targetLang.toUpperCase()
        })
    });

    if (!response.ok) {
    throw new Error(response.statusText);
}

const data = await response.json();

if (!data || !data.translations || data.translations.length === 0) {
    throw new Error("No translations found in the response from the translations API");
}

return data.translations[0].text;
}