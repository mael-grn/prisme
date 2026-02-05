import axios from "axios";
import {NextResponse} from "next/server";

/**
 * Root de l'api pour récupérer les données d'un site à partir de son id ou de son domaine.
 * Option recursive pour récupérer les données de toutes les pages et sections du site, nécessaire pour l'affichage du site dans le frontend.
 * @param request Pas utilisé, mais nécessaire pour que Next.js reconnaisse cette fonction comme une route d'api.
 * @param params
 * @constructor
 */
export async function GET(request: Request, {params}: { params: Promise<{ idOrDomain: string }> }) {
    try {
        const {idOrDomain} = await params;
        const response = await axios.get(`https://admin.maelg.fr/api/websites/${idOrDomain}?recursive=true`)
        return NextResponse.json(response.data.data, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, {status: 500});
    }
}
