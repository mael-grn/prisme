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

/**
 * Utility class for API, that centralize API behavior
 * Globally, every check and action on the API will throw an error if there is a problem (user not connected, SQL error, ...)
 * At the end of every endpoint, the errors are catch and treated in order to return the correct http error code
 */
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

    /**
     * Check if there is a token and verify it, throw if token not found or invalid
     */
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

    /**
     * Return a well formated NextResponse object in case everything happened successfully
     * @param data if there is data to return
     * @param newFieldCreated weather to return 201 or 200 http code
     */
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

    /**
     * Well formatted NextResponse object for errors
     * @param message
     * @param error
     * @param statusCode
     */
    static getErrorNextResponse(message?: string, error?: Error, statusCode = 500) {
        return NextResponse.json({
            success: false,
            message: message || "API error",
            error: error,
            data: null
        }, {status: statusCode});
    }

    /**
     * Check if there is a recursive == true in url parameters
     * @param request
     */
    static isRecursiveRequest(request: Request): boolean {
        const url = new URL(request.url);
        return url.searchParams.get("recursive") === "true";
    }

    /**
     * Does what is says
     */
    static async getConnectedUserOrNull() : Promise<User | null> {
        try {
            return UserService.getMyUser()
        } catch (e) {
            return null;
        }
    }

    /**
     * Return the correct NextResponse error depending on the type of Error
     * @param e
     */
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