import ServiceResponse from "@/app/models/serviceResponse";
import axios from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import {User} from "@/app/models/user";

export default class SessionService {
    static async login(username: string, password: string): Promise<ServiceResponse<User>> {
        const response = await axios.post('/api/session', {username, password});
        if (response.status === 200) {
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }
}