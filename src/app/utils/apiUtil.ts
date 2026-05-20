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
    static getErrorNextResponse(message?: string, statusCode = 500, error?: Error) {
        return NextResponse.json({
            success: false,
            message: message || "API error",
            error: error,
            data: null
        }, {status: statusCode});
    }


    /**
     * Return the correct NextResponse error depending on the type of Error
     * @param e
     */
    static handleNextErrors(e: Error) {
        console.error(e);
        if (e instanceof NeonDbError) {
            return this.getErrorNextResponse("SQL error", SqlUtil.getHttpCodeFromSqlError(e.code), e);
        }else if (e instanceof UserNotFoundError) {
            return this.getErrorNextResponse("User not found",  404, e);
        }else if (e instanceof UserNotLoggedIn) {
            return this.getErrorNextResponse("User not connected", 401, e);
        }else if (e instanceof InvalidFieldsError) {
            return this.getErrorNextResponse("Object has invalid fields", 422, e);

        } else if (e instanceof InvalidParamsError) {
            return this.getErrorNextResponse("Missing or invalid query parameters", 400, e);
        } else {
            return this.getErrorNextResponse("API error", 500, e);
        }
    }

    static checkParam(param?: string) {
        if (!param) {
            throw new InvalidParamsError("Parameter is required");
        }
    }
}