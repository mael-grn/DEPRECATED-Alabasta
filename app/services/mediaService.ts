import {getMediaDetails, getPopularMovies} from "@/app/utils/tmdbUtil";
import LightMedia from "@/app/models/lightMedia";
import {Media} from "@/app/models/media";

export default class MediaService {
    static async getPopular(): Promise<LightMedia[]> {
        return await getPopularMovies()
    }

    static async getDetails(mediaId: string): Promise<Media> {
        return await getMediaDetails(mediaId);
    }
}