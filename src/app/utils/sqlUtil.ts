import {neon, NeonQueryFunction} from "@neondatabase/serverless";

/**
 * Some useful this to do in SQL about connexion and error management
 * Singleton pattern for the connexion, no need to duplicate it for every execution
 */
export class SqlUtil {

    private static sql : NeonQueryFunction<false, false>
    static getSql() {
        if (!this.sql) {
            this.sql = neon(`${process.env.DATABASE_URL}`);
        }
        return this.sql;
    }

    /**
     * Get the correct http code corresponding to the neon's postgreSQL error code.
     * @param code
     */
    static getHttpCodeFromSqlError = (code?: string) => {
        switch (code) {
            // unique violation
            case "23505":
                return 409;
            // foreign key violation
            case "23503":
                return 409;
            // not null violation
            case "23502":
                return 400;
            // invalid text representation (e.g. parse int fail)
            case "22P02":
                return 400;
            // syntax error in SQL
            case "42601":
                return 400;
            // check constraint violation
            case "23514":
                return 400;
            // value too long for type / truncation
            case "22001":
                return 400;
            // default pour erreurs inattendues côté serveur
            default:
                return 500;
        }
    };
}