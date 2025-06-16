import ServiceResponse from "@/app/models/serviceResponse";
import axios from "axios";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import {Opinion} from "@/app/models/opinion";

export default class OpinionService {
    static async getUserOpinions(userId: number): Promise<ServiceResponse<Opinion[]>> {
        const response = await axios.get(`/api/user/${userId}/opinion`, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as Opinion[]
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }
}