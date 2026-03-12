import {ApiUtil} from "@/app/utils/apiUtil";
import {User} from "@/app/models/User";

export async function GET() {
    try {
        const user = await ApiUtil.getConnectedUser();
        return ApiUtil.getSuccessNextResponse<User>(user);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }

}