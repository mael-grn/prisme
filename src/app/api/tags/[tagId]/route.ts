import {ApiUtil} from "@/app/utils/apiUtil";
import {SqlUtil} from "@/app/utils/sqlUtil";
import {InsertableTag, Tag} from "@/app/models/Tag";
import {TagSchema} from "@/app/schemas/TagSchema";

export async function PUT(request: Request, {params}: { params: Promise<{ categoryId: string }> }) {

    try {
        const {categoryId} = await params;
        ApiUtil.checkParam(categoryId);
        const insertableCategory: InsertableTag = await request.json();
        const resultat = TagSchema.safeParse(insertableCategory);
        if (!resultat.success) {
            return ApiUtil.getErrorNextResponse("Entity not good", 422);
        }
        const sql = SqlUtil.getSql()

        //on récupère le site internet
        const [res] = await sql`
            update tag set name = ${insertableCategory.name} where id = ${categoryId} returning *
        `;
        return ApiUtil.getSuccessNextResponse<Tag>(res as Tag);
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}

export async function DELETE(request: Request, {params}: { params: Promise<{ categoryId: string }> }) {

    try {
        const {categoryId} = await params;
        ApiUtil.checkParam(categoryId);

        const sql = SqlUtil.getSql()

        const sectionsWithCategory = await sql`
            select 1 from element_tag where element_tag.tag_id = ${categoryId} limit 1
        `;

        if (sectionsWithCategory.length > 0) {
            return ApiUtil.getErrorNextResponse("Le tag ne peut pas être supprimée car il est utilisé par des elements.", 400);
        }

        //on récupère le site internet
        await sql`
            delete from tag where id = ${categoryId}
        `;
        return ApiUtil.getSuccessNextResponse();
    } catch (e) {
        return ApiUtil.handleNextErrors(e as Error);
    }

}