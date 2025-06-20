
import {Media} from "@/app/models/media";
import axios, {AxiosError} from "axios";
import HomeMediaLists from "../models/homeMediaLists";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";
import {TmdbMagnetLink} from "@/app/models/tmdbMagnetLink";
import MeService from "@/app/services/meService";

export default class MediaService {
    static async getPopular(): Promise<HomeMediaLists> {
        try {
            const response = await axios.get('/api/media/', {withCredentials: true});
            return response.data as HomeMediaLists;
        } catch (e) {
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getDetails(mediaId: string): Promise<Media> {
        try {
            const response = await axios.get('/api/media/' + mediaId, {withCredentials: true});
            return response.data as Media;
        } catch (e) {
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getMagnetLinks(mediaId: string): Promise<TmdbMagnetLink[]> {
        try {
            const response = await axios.get(`/api/media/${mediaId}/magnet-link`, {withCredentials: true});
            return response.data as TmdbMagnetLink[];
        } catch (e) {
            if ((e as AxiosError).response?.status === 404) {
                return [];
            }
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async searchMagnetLinks(mediaId: string): Promise<TmdbMagnetLink[]> {
        try {
            const response = await axios.get(`/api/media/${mediaId}/magnet-link?search=true`, {withCredentials: true});
            return response.data as TmdbMagnetLink[];
        } catch (e) {
            if ((e as AxiosError).response?.status === 404) {
                return [];
            }
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async initStream(magnetLink: TmdbMagnetLink): Promise<string> {
        const me = await MeService.getMe();
        try {
            await axios.get(`https://alabasta-stream-api.vercel.app/load?username=${me.username}&magnet=${magnetLink.magnet_link}`)
            return `https://alabasta-stream-api.vercel.app/stream?username=${me.username}`
        } catch (e) {
            console.log(e)
            throw getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }
}