import {User} from "@/app/models/User";
import axios, {AxiosError} from "axios";
import StringUtil from "@/app/utils/StringUtil";

export default class UserService {

    /**
     * Get the current logged in user
     */
    static async getMyUser(): Promise<User> {
        try {

            const response = await axios.get(`/api/me`);
            return response.data.data as User;

        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}