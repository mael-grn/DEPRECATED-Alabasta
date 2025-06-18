import {getPopularMovies} from "@/app/utils/tmdbUtil";
import LightMedia from "@/app/models/lightMedia";

export default class MediaService {
    static async getPopular(): Promise<LightMedia[]> {
        return await getPopularMovies()
    }
}