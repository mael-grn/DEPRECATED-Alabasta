import ServiceResponse from "@/app/models/serviceResponse";
import {User} from "@/app/models/user";
import axios, {AxiosError} from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";

export default class SubscriptionService {
    static async getUserSubscriptions(userId: number): Promise<ServiceResponse<User[]>> {
        try {
            const response = await axios.get(`/api/user/${userId}/subscription`, {withCredentials: true});
            return {
                success: true,
                data: response.data as User[]
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || 500)
            };
        }
    }

    static async getMySubscriptions(): Promise<ServiceResponse<User[]>> {
        try {
            const response = await axios.get(`/api/me/subscription`, {withCredentials: true});
            return {
                success: true,
                data: response.data as User[]
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || 500)
            };
        }
    }

    static async amISubscribedToThisUser(userId: number): Promise<ServiceResponse<boolean>> {
        try {
            await axios.get(`/api/me/subscription/${userId}`, {withCredentials: true});
            return {
                success: true,
                data: true
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || 500)
            };
        }
    }
}