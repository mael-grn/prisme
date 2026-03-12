import {cookies} from "next/headers";
import {User} from "@/app/models/User";
import {TokenUtil} from "@/app/utils/tokenUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {NeonDbError} from "@neondatabase/serverless";
import {NextResponse} from "next/server";
import {UserNotFoundError} from "@/app/errors/UserNotFoundError";
import {InvalidFieldsError} from "@/app/errors/InvalidFieldsError";
import {InvalidParamsError} from "@/app/errors/InvalidParamsError";
import UserService from "@/app/services/UserService";
import {UserNotLoggedIn} from "@/app/errors/UserNotLoggedIn";
import axios from "axios";

export class ApiUtil {

    /**
     * Récupère l'utilisateur connecté à partir du token dans les cookies
     */
    static async getConnectedUser() : Promise<User> {
        'use server';
        // On n'a pas forcément accès aux cookies de domaines automatiquement avec axios, donc on le récupère manuellement
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get('token');
            const config = {
                headers: token && token.value ? { Authorization: `Bearer ${token.value}` } : {}
            };
            // Envoi de la requête avec les headers si le token existe
            const response = await axios.get(`https://account.maelg.fr/api/me`, config);
            return response.data.data as User;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401 || e.response?.status === 403) {
                    throw new UserNotLoggedIn();
                }
            }
            throw new UserNotFoundError();
        }
    }

    static async verifyTokenOrThrow() : Promise<void> {
        'use server';
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        const userId = await TokenUtil.getIdFromToken(token!.value);

        // Si pas de token ou token invalide
        if (!userId) {
            throw new UserNotFoundError();
        }
    }


    static getSuccessNextResponse<T>(data? : T, newFieldCreated = false) {
        if (data) {
            return NextResponse.json({
                success: true,
                data: data
            }, {status: newFieldCreated ? 201 : 200});
        } else {
            return NextResponse.json({
                success: true
            }, {status: newFieldCreated ? 201 : 200});
        }
    }

    static getErrorNextResponse(message?: string, error?: Error, statusCode = 500) {
        return NextResponse.json({
            success: false,
            message: message || "API error",
            error: error,
            data: null
        }, {status: statusCode});
    }

    static isRecursiveRequest(request: Request): boolean {
        const url = new URL(request.url);
        return url.searchParams.get("recursive") === "true";
    }

    static async getConnectedUserOrNull() : Promise<User | null> {
        try {
            return UserService.getMyUser()
        } catch (e) {
            return null;
        }
    }

    static handleNextErrors(e: Error) {
        console.error(e);
        if (e instanceof NeonDbError) {
            return this.getErrorNextResponse("SQL error", e, SqlUtil.getHttpCodeFromSqlError(e.code));
        }else if (e instanceof UserNotFoundError) {
            return this.getErrorNextResponse("User not found", e, 404);
        }else if (e instanceof UserNotLoggedIn) {
            return this.getErrorNextResponse("User not connected", e, 401);
        }else if (e instanceof InvalidFieldsError) {
            return this.getErrorNextResponse("Object has invalid fields", e, 422);

        } else if (e instanceof InvalidParamsError) {
            return this.getErrorNextResponse("Missing or invalid query parameters", e, 400);
        } else {
            return this.getErrorNextResponse("API error", e, 500);
        }
    }

    static checkParam(param?: string) {
        if (!param) {
            throw new InvalidParamsError("Parameter is required");
        }
    }
}