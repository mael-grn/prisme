import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";
import {TokenUtil} from "@/app/utils/tokenUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";

export async function middleware(request: NextRequest) {

    // On exclue les requetes GET sur l'api, car les données doivent être publiques
    if (request.nextUrl.pathname.startsWith('/api') && request.method === 'GET') {
        return NextResponse.next();
    }

    // On récupère le cookie 'token' pour vérifier l'authentification
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    // Si le token existe pas erreur 401
    if (!token || !token.value || token.value.length === 0) {
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json("Non autorisé", { status: 401 });
        } else {
            return NextResponse.redirect("https://account.maelg.fr/login?redirect=" + request.nextUrl);
        }
    }

    // On vérifie le token
    const res = await TokenUtil.verifyToken(token.value);

    // Si le token est invalide ou expiré, on supprime le cookie et retourne une erreur 401
    if (!res) {
        cookieStore.delete('token');
        cookieStore.delete('user');
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json("Non autorisé", { status: 401 });
        } else {
            return NextResponse.redirect("https://account.maelg.fr/login?redirect=" + request.nextUrl);
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/secure/:path*',
        '/api/:path*',
    ],
}