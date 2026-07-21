
import { jwtVerify} from 'jose';

/**
 * Class to manage token over the app
 */
export class TokenUtil {

    static secret = process.env.JWT_SECRET!;

    /**
     * Verify token's validity and return a boolean
     * The token encryption key is supposed to be the same on the login's project (azimut) so that the verification can be done here
     * @param token
     */
    static async verifyToken(token: string): Promise<boolean> {
        try {
            const encoder = new TextEncoder();
            await jwtVerify(token, encoder.encode(TokenUtil.secret));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Return the id encrypted in the token
     * @param token
     */
    static async getIdFromToken(token: string): Promise<number | null> {
        try {
            const encoder = new TextEncoder();
            const { payload } = await jwtVerify(token, encoder.encode(TokenUtil.secret));
            return payload.id as unknown as number;
        } catch {
            return null;
        }

    }
}