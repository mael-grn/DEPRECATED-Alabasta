import ServiceResponse from "@/app/models/serviceResponse";
import axios, {AxiosError} from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import {Opinion} from "@/app/models/opinion";

export default class OpinionService {
    static async getUserOpinions(userId: number): Promise<ServiceResponse<Opinion[]>> {
        try {
            const response = await axios.get(`/api/user/${userId}/opinion`, {withCredentials: true});
            return {
                success: true,
                data: response.data as Opinion[]
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }
}