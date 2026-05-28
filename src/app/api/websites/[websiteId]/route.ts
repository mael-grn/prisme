import type {Website, InsertableWebsite} from "@/app/models/Website";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {ApiUtil} from "@/app/utils/apiUtil";
import StringUtil from "@/app/utils/StringUtil";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";

export async function GET(request: Request, {params}: { params: Promise<{ websiteId: string }> }) {
    try {
        const {websiteId} = await params;
        ApiUtil.checkParam(websiteId);

        const sql = SqlUtil.getSql();
        let res;

        // On recupere le site en fonction du type de clé fournie
        if (StringUtil.isInteger(websiteId)) {

            const id = Number(websiteId);
            [res] = await sql`SELECT *
                              FROM website
                              WHERE id = ${id}
                              LIMIT 1`;
        } else if ((websiteId as string).includes(".")) {

            [res] = await sql`SELECT *
                              FROM website
                              WHERE website_domain = ${websiteId}
                              LIMIT 1`;
        } else {
            [res] = await sql`SELECT *
                              FROM website
                              WHERE title ilike ${(websiteId as string).replaceAll('%20', ' ')}
                              LIMIT 1`;
        }

        if (!res) {
            return ApiUtil.getErrorNextResponse("Website not found", 404);
        }

        // Si le domaine n'est pas specifié, on met undefined pour globaliser
        if (res.website_domain && (res.website_domain === "" || res.website_domain === "null" || res.website_domain === null)) {
            res.website_domain = undefined;
        }

        return ApiUtil.getSuccessNextResponse<Website>(res as Website);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}

export async function DELETE(request: Request, {params}: { params: Promise<{ websiteId: string }> }) {
    try {
        const {websiteId} = await params;
        ApiUtil.checkParam(websiteId);

        const user = await ApiUtil.getConnectedUser();
        const sql = SqlUtil.getSql();

        let website;
        if (StringUtil.isInteger(websiteId)) {
            const id = Number(websiteId);
            [website] = await sql`SELECT *
                                  FROM website
                                  WHERE id = ${id}
                                  LIMIT 1`;
        } else {
            [website] = await sql`SELECT *
                                  FROM website
                                  WHERE website_domain = ${websiteId}
                                  LIMIT 1`;
        }

        if (!website) {
            return ApiUtil.getErrorNextResponse("Website not found", 404);
        }

        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner of this website", 403);
        }

        await sql`DELETE
                  FROM website
                  WHERE id = ${website.id}`;
        return ApiUtil.getSuccessNextResponse();
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}

export async function PUT(request: Request, {params}: { params: Promise<{ websiteId: string }> }) {
    try {
        const {websiteId} = await params;
        ApiUtil.checkParam(websiteId);

        const user = await ApiUtil.getConnectedUser();
        const sql = SqlUtil.getSql();

        let website;
        if (StringUtil.isInteger(websiteId)) {
            const id = Number(websiteId);
            [website] = await sql`SELECT *
                                  FROM website
                                  WHERE id = ${id}
                                  LIMIT 1`;
        } else {
            [website] = await sql`SELECT *
                                  FROM website
                                  WHERE website_domain = ${websiteId}
                                  LIMIT 1`;
        }

        if (!website) {
            return ApiUtil.getErrorNextResponse("Website not found", 404);
        }

        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner of this website", 403);
        }

        const insertableWebsite: InsertableWebsite = await request.json();
        const resultat = websiteSchema.safeParse(insertableWebsite);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        const [res] = await sql`
            UPDATE website
            SET website_domain = ${insertableWebsite.website_domain},
                title     = ${insertableWebsite.title}
            WHERE id = ${website.id}
            RETURNING *
        `;

        return ApiUtil.getSuccessNextResponse<Website>(res as Website);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}