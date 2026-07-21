import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {InsertableElement, Element} from "@/app/models/Element";
import {websiteSchema} from "@/app/schemas/WebsiteSchema";
import {elementSchema} from "@/app/schemas/ElementSchema";

export async function GET(request: Request, {params}: { params: Promise<{ elementId: string }> }) {

    try {
        const {elementId} = await params;
        ApiUtil.checkParam(elementId);

        const sql = SqlUtil.getSql()

        const [element] = await sql`SELECT * FROM element WHERE id = ${elementId} LIMIT 1`;

        if (!element) {
            return ApiUtil.getErrorNextResponse("Element not found", 404);
        }
        return ApiUtil.getSuccessNextResponse<Element>(element as Element);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}

export async function PUT(request: Request, {params}: { params: Promise<{ elementId: string }> }) {

    try {
        const {elementId} = await params;
        ApiUtil.checkParam(elementId);

        // On récupère l'utilisateur connecté
        const user = await ApiUtil.getConnectedUser();

        // Récupération des données dans le body
        const element: Element = await request.json();

        const sql = SqlUtil.getSql()

        //on récupère le site internet
        const [website] = await sql`
            SELECT website.*
            FROM website,
                 page,
                 element
            WHERE 
                element.id = ${elementId}
             and element.page_id = page.id
            and page.website_id = website.id
            LIMIT 1
        `;

        // On vérifie que le site appartient bien à l'utilisateur
        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner", 403);
        }

        // Validation des données
        const resultat = elementSchema.safeParse(element);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        const [res] = await sql`UPDATE element
                  SET element_type      = ${element.element_type}, content = ${element.content}
                  WHERE id = ${elementId} returning *`;

        return ApiUtil.getSuccessNextResponse<Element>(res as Element);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}

export async function DELETE(request: Request, {params}: { params: Promise<{ elementId: string }> }) {

    try {
        const {elementId} = await params;
        ApiUtil.checkParam(elementId);

        // On récupère l'utilisateur connecté
        const user = await ApiUtil.getConnectedUser();

        const sql = SqlUtil.getSql()

        //on récupère le site internet
        const [website] = await sql`
            SELECT website.*
            FROM website,
                 page,
                 element
            WHERE
                element.id = ${elementId}
              and element.page_id = page.id
              and page.website_id = website.id
            LIMIT 1
        `;

        // On vérifie que le site appartient bien à l'utilisateur
        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner", 403);
        }

        await sql`DELETE FROM element where element.id = ${elementId}`;

        return ApiUtil.getSuccessNextResponse();
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}