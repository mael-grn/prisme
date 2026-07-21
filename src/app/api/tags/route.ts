import {SqlUtil} from "@/app/utils/sqlUtil";
import {ApiUtil} from "@/app/utils/apiUtil";
import {Tag, InsertableTag} from "../../models/Tag";
import {pageSchema} from "@/app/schemas/PageSchema";
import {TagSchema} from "@/app/schemas/TagSchema";

export async function POST(request: Request) {
    try {
        // Récupération des données dans le body
        const insertableCategory: InsertableTag = await request.json();
        const resultat = TagSchema.safeParse(insertableCategory);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        // Insertion en base de données
        const sql = SqlUtil.getSql()
        const [res] = await sql`
            INSERT INTO categories (name) values (${insertableCategory.name}) returning *
        `;

        return ApiUtil.getSuccessNextResponse<Tag>(res as Tag, true);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}

export async function GET(request: Request) {
    try {
        const sql = SqlUtil.getSql();

        const data = await sql`
                SELECT * FROM categories
            `;
        return ApiUtil.getSuccessNextResponse<Tag[]>(data as Tag[]);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}