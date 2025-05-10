import ServiceResponse from "@/app/models/ServiceResponse";
import StreamLink from "@/app/models/StreamLink";
import ErrorType from "@/app/enum/ErrorTypeEnum";
import User from "@/app/models/user";

export default class StreamService {

    static async getMagnetLinks(tmdbId: string): Promise<ServiceResponse<StreamLink[]>> {

        const response = await fetch('/api/provider/' + tmdbId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 404) {
            return {success: false, error: ErrorType.MEDIA_NOT_FOUND}
        }
        if (!response.ok) {
            return {success: false, error: ErrorType.SERVER_ERROR}
        }

        const data = await response.json();
        return {
            success: true,
            data: data.links
        };
    }

    static async getVideoLink(magnetUrl: string): Promise<ServiceResponse<string>> {

        console.log("aaa")
        const res = await fetch("/api/auth");

        if (!res.ok) {
            return {success: false, error: ErrorType.SERVER_ERROR}
        }

        const data = await res.json();
        const user : User = data.user;

        const responseLoad = await fetch(`https://alabasta-stream-api.vercel.app/load?username=${user.username}&magnet=${magnetUrl}`)
        if (responseLoad.status === 404) {
            return {success: false, error: ErrorType.MEDIA_NOT_FOUND}
        }
        if (!responseLoad.ok) {
            return {
                success: false,
                error: ErrorType.FAILED_TO_STREAM
            }
        }
        return {
            success: true,
            data: `https://alabasta-stream-api.vercel.app/stream?username=${user.username}`
        }
    }
}