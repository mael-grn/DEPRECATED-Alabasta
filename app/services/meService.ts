import axios, {AxiosError} from "axios";
import {User} from "@/app/models/user";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import ServiceResponse from "@/app/models/serviceResponse";

export default class MeService {
    static async getMe(): Promise<ServiceResponse<User>> {
        try {
            const response = await axios.get('/api/me/', {withCredentials: true});
            return {
                success: true,
                data: response.data as User
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || 500)
            };
        }
    }
}