import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";
import {TokenUtil} from "@/app/utils/tokenUtil";

/**
 * This file prevent users to make request and load protected pages
 * If an unauthorized user wants to access protected ressource, he will be:
 * - Redirected to the login page if he tries to access protected web pages
 * - Receive a 401 error if he tries to access protected endpoints
 * @param request
 */
export async function middleware(request: NextRequest) {

    if (request.nextUrl.pathname.startsWith('/api/translations')) {
        return NextResponse.next();
    }

    // GET requests arent protected on the API
    if (request.nextUrl.pathname.startsWith('/api') && request.method === 'GET') {
        return NextResponse.next();
    }

    // Loading the token in the cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    // If no token error or redirect to login page depending of the request
    if (!token || !token.value || token.value.length === 0) {
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json("Non autorisé", { status: 401 });
        } else {
            return NextResponse.redirect("https://account.maelg.fr/login?redirect=" + request.nextUrl);
        }
    }

    // Checkin token
    const res = await TokenUtil.verifyToken(token.value);
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

/**
 * Protected pages are those rooting in /secure and /api
 */
export const config = {
    matcher: [
        '/secure/:path*',
        '/api/:path*',
    ],
}