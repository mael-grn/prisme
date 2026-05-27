import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers";
import { TokenUtil } from "@/app/utils/tokenUtil";
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Initialisation du middleware de next-intl avec votre configuration de langues
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Redirection spécifique au Portfolio
    if (pathname.includes('/portfolio')) {
        return NextResponse.redirect("https://old.maelg.fr");
    }

    const isApiRoute = pathname.startsWith('/api');
    let response = NextResponse.next();

    // 2. Gestion de la locale par next-intl (Uniquement hors API)
    if (!isApiRoute) {
        // intlMiddleware gère la détection de la langue et applique les cookies nécessaires
        response = intlMiddleware(request);

        // Si next-intl décide de rediriger (ex: rajouter /fr), on retourne sa réponse immédiatement
        if (response.status === 307 || response.status === 308) {
            return response;
        }
    } else {
        // Si une route d'API arrive par erreur avec une locale (ex: /fr/api/...), on nettoie l'URL
        const hasLocale = routing.locales.some(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );
        if (hasLocale) {
            request.nextUrl.pathname = pathname.replace(/^\/[^\/]+\//, '/');
            return NextResponse.redirect(request.nextUrl);
        }
    }

    // 3. Normalisation du chemin pour vos vérifications de sécurité suivantes
    // (Retire le /fr ou /en au début s'il est présent)
    const normalizedPath = isApiRoute ? pathname : pathname.replace(/^\/(fr|en)/, '');

    // 4. Filtrage des routes publiques (API ou Pages Web qui ne sont pas le dashboard)
    if (!isApiRoute) {
        // Si la page web demandée n'est PAS le dashboard, on laisse passer sans token
        if (!normalizedPath.startsWith("/dashboard")) {
            return response;
        }
    } else {
        // Routes d'API autorisées sans authentification
        const apiAuthorized = ["translations", "colors"];
        const isAuthorized = apiAuthorized.some(route =>
            pathname.startsWith(`/api/${route}`)
        );

        if (isAuthorized || request.method === 'GET') {
            return response;
        }
    }

    // 5. Vérification du Jeton (Token) pour les zones sécurisées (API privées et /dashboard)
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    // Si aucun token n'est présent
    if (!token || !token.value || token.value.length === 0) {
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json("Unauthorized", { status: 401 });
        } else {
            return NextResponse.redirect("https://account.maelg.fr/login?redirect=" + request.nextUrl);
        }
    }
    // Vérification de la validité du token
    const res = await TokenUtil.verifyToken(token.value);
    if (!res) {
        cookieStore.delete('token');
        cookieStore.delete('user');
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json("Unauthorized", { status: 401 });
        } else {
            return NextResponse.redirect("https://account.maelg.fr/login?redirect=" + request.nextUrl);
        }
    }



    // On retourne la réponse (qui contient les en-têtes de langue de next-intl si hors-API)
    return response;
}

export const config = {
    // Conservation de vos dossiers d'assets statiques exclus
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|illustrations|ico|img).*)',
    ],
}