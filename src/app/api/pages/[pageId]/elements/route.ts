import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {Element} from "@/app/models/Element";
import {LexicalPositionUtil} from "@/app/utils/LexicalPositionUtil";
import {InsertableElement} from "@/app/models/Element";
import {pageSchema} from "@/app/schemas/PageSchema";
import {elementSchema} from "@/app/schemas/ElementSchema";

export async function GET(request: Request, {params}: { params: Promise<{ pageId: string }> }) {

    try {
        const {pageId} = await params;
        ApiUtil.checkParam(pageId);

        const sql = SqlUtil.getSql()

        const res = await sql`
           select * from element where page_id = ${pageId}`;`
        `;
        return ApiUtil.getSuccessNextResponse<Element[]>(res as Element[]);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}

export async function POST(request: Request, { params }: { params: Promise<{ pageId: string }> }) {

    try {
        const { pageId } = await params;

        ApiUtil.checkParam(pageId);

        // On récupère l'utilisateur connecté
        const user = await ApiUtil.getConnectedUser();


        const sql = SqlUtil.getSql()

        //on récupère le site internet
        const [website] = await sql`
        SELECT website.* FROM website, page WHERE page.id = ${pageId} and website.id = website_id LIMIT 1
    `;

        // On vérifie que le site appartient bien à l'utilisateur
        if (website.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner of this website", 403);
        }

        // Récupération des données dans le body
        const insertableElement: InsertableElement = await request.json();

        // Si father id, on verifie que le father appartien au user
        const [fatherWebsite] = await sql`
        SELECT website.* FROM website, page WHERE page.id = ${insertableElement.page_id} and website.id = website_id LIMIT 1
    `;
        if (fatherWebsite.owner_id !== user.id) {
            return ApiUtil.getErrorNextResponse("You are not the owner of the website of the father element", 403);
        }

        // Validation des données
        const resultat = elementSchema.safeParse(insertableElement);
        console.log(resultat);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        const elements : Element[] = await sql`SELECT * FROM element WHERE page_id = ${website.id}` as unknown as Element[];
        const pos = LexicalPositionUtil.getNextPosition(elements);
        const [res] = await sql`INSERT INTO element (page_id, element_type, content, position, father_element_id)
              VALUES (${insertableElement.page_id}, ${insertableElement.element_type}, ${insertableElement.content}, ${pos}, ${insertableElement.father_element_id})
              RETURNING *`;


        return ApiUtil.getSuccessNextResponse<Element>(res as Element, true);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error)
    }
}