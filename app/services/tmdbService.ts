import Media from "@/app/models/media";
import LightMedia from "@/app/models/LightMedia";
import MediaType from "@/app/enum/MediaTypeEnum";
import ServiceResponse from "@/app/models/ServiceResponse";
import ErrorType from "@/app/enum/ErrorTypeEnum";
import {TmdbLightMedia} from "@/app/models/tmdbLightMedia";
import TmdbGenre from "@/app/models/TmdbGenre";

export default class TmdbService {

    static apiKey: string = process.env.NEXT_PUBLIC_TMDB_KEY ?? "";

    private static parseLightMovie(data: TmdbLightMedia) : LightMedia {
        return {
            title: data.title,
            year: parseInt(data.release_date?.split('-')[0] ?? 2005),
            posterUrl: data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "",
            type: MediaType.MOVIE,
            tmdbId: data.id,
        }
    }

    static async getPopularMovies() : Promise<ServiceResponse<LightMedia[]>> {
        const url = 'https://api.themoviedb.org/3/movie/popular?language=fr&page=1';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const res = await fetch(url, options);

        if (!res.ok) {
            return {
                success: false,
                error: ErrorType.TMDB_API_ERROR
            }
        }

        const data = await res.json();

        const mediaList : LightMedia[] = [];
        for (const item of data.results) {
            if (item.poster_path && item.release_date) {
                mediaList.push(this.parseLightMovie(item));
            }
        }

        return {
            success: true,
            data: mediaList,
        };
    }

    static async getMovieDetails(tmdbId: string, lang: string = "fr") : Promise<ServiceResponse<Media>> {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}?language=${lang}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const res = await fetch(url, options)

        if (res.status ===404) {
            return {
                success: false,
                error: ErrorType.MEDIA_NOT_FOUND
            }
        }

        if (!res.ok) {
            return {
                success: false,
                error: ErrorType.TMDB_API_ERROR
            }
        }

        const data = await res.json();

        return {
            success: true,
            data: {
                type: MediaType.MOVIE,
                title: data.title,
                year: data.release_date.split('-')[0],
                posterUrl: data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "",
                backdropUrl: "https://image.tmdb.org/t/p/w1280" + data.backdrop_path,
                streamLinks: [],
                genres: data.genres.map((genre:TmdbGenre) => genre.name),
                imdbId: data.imdb_id,
                vo: data.original_language,
                overview: data.overview,
                runtime: parseFloat(data.runtime),
                vote: data.vote_average,
                voteCount: data.vote_count,
                tmdbId: tmdbId,
            }
        }
    }

    static async searchMovie(queryString: string): Promise<ServiceResponse<LightMedia[]>> {

        const url = `https://api.themoviedb.org/3/search/movie?query=${queryString}&include_adult=false&language=fr`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const movieRes = await fetch(url, options);

        if (!movieRes.ok) {
            return {
                success: false,
                error: ErrorType.TMDB_API_ERROR
            }
        }

        const movieData = await movieRes.json();
        const mediaList: LightMedia[] = [];

        for (const item of movieData.results) {
            if (item.poster_path && item.release_date) {
                mediaList.push(this.parseLightMovie(item));
            }
        }

        return {
            success: true,
            data: mediaList,
        };
    }
}