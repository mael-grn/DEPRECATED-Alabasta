import ServiceResponse from "@/app/models/serviceResponse";
import axios, {AxiosError} from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import {User} from "@/app/models/user";

export default class SessionService {
    static async login(username: string, password: string): Promise<ServiceResponse<User>> {
        try {
            await axios.post('/api/session', {username, password});
            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async logout(): Promise<ServiceResponse<User>> {
        try {
            await axios.delete('/api/session');
            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }
}