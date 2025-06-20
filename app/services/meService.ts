import axios, {AxiosError} from "axios";
import {User} from "@/app/models/user";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";

export default class MeService {
    static async getMe(): Promise<User> {
        try {
            const response = await axios.get('/api/me/', {withCredentials: true});
            return response.data as User;
        } catch (e) {
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}