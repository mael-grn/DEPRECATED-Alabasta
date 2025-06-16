import ServiceResponse from "@/app/models/serviceResponse";
import {User} from "@/app/models/user";
import axios from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";

export default class SubscriptionService {
    static async getUserSubscriptions(userId: number): Promise<ServiceResponse<User[]>> {
        const response = await axios.get(`/api/user/${userId}/subscription`, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as User[]
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async getMySubscriptions(): Promise<ServiceResponse<User[]>> {
        const response = await axios.get(`/api/me/subscription`, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as User[]
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async amISubscribedToThisUser(userId: number): Promise<ServiceResponse<boolean>> {
        const response = await axios.get(`/api/me/subscription/${userId}`, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: true
            };
        } else {
            if (response.status === 404) {
                return {
                    success: true,
                    data: false
                };
            }
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }
}