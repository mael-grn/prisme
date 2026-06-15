import {Website, InsertableWebsite} from "@/app/models/Website";
import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {elementSchema} from "@/app/schemas/ElementSchema";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";

/**
 * Create a new display website for the connected user
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    try {

        // Récupération de l'utilisateur connecté
        const user = await ApiUtil.getConnectedUser();

        // Récupération des données dans le body
        const insertableWebsite: InsertableWebsite = await request.json();

        // Validation des données
        const resultat = websiteSchema.safeParse(insertableWebsite);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        // Insertion en base de données
        const sql = SqlUtil.getSql()
        let res : Website;

        if (insertableWebsite.website_domain && insertableWebsite.image_src) {
            [res] = await sql`
                INSERT INTO website (owner_id, title, website_domain, image_src)
                VALUES (${user.id}, ${insertableWebsite.title}, ${insertableWebsite.website_domain}, ${insertableWebsite.image_src})
                    returning *
            ` as unknown as Website[]
        } else if (insertableWebsite.website_domain) {
            [res] = await sql`
            INSERT INTO website (owner_id, title, website_domain)
            VALUES (${user.id}, ${insertableWebsite.title}, ${insertableWebsite.website_domain})
            returning *
        ` as unknown as Website[]
        } else if (insertableWebsite.image_src) {
            [res] = await sql`
            INSERT INTO website (owner_id, title, image_src)
            VALUES (${user.id}, ${insertableWebsite.title}, ${insertableWebsite.image_src})
            returning *
        ` as unknown as Website[]
        } else {
            [res] = await sql`
            INSERT INTO website (owner_id, title)
            VALUES (${user.id}, ${insertableWebsite.title}) returning *
        ` as unknown as Website[]
        }


        // Retour de la nouvelle ressource avec le token en clair, disponible uniquement une fois
        return ApiUtil.getSuccessNextResponse<Website>(res);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}

export async function GET() {
    try {
        const user = await ApiUtil.getConnectedUser();

        const sql = SqlUtil.getSql()
        const res = await sql`
            SELECT *
            FROM website
            WHERE owner_id = ${user.id}
        `;

        const modifiedList: Website[] = [];
        for (const website of res) {
            const modifiedWebsite: Website = {
                ...website as Website,
            }
            if (modifiedWebsite.website_domain && (modifiedWebsite.website_domain === "" || modifiedWebsite.website_domain === "null" || modifiedWebsite.website_domain === null)) {
                modifiedWebsite.website_domain = undefined;
            }
            modifiedList.push(modifiedWebsite)
        }
        return ApiUtil.getSuccessNextResponse<Website[]>(modifiedList);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }

}