import {Media} from "@/app/models/media";
import MediaType from "@/app/enums/mediaTypeEnum";
import LightMedia from "@/app/models/lightMedia";


export function parseLightMedia(data: {
    title: string,
    release_date: string | undefined,
    first_air_date: string | undefined,
    poster_path: string,
    id: string
}, type: MediaType): LightMedia {
    return {
        title: data.title,
        year: parseInt(data.release_date?.split('-')[0] ?? data.first_air_date?.split('-')[0] ?? '1970'),
        posterUrl: data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "",
        type: type,
        tmdbId: data.id,
    }
}

export async function getPopularMovies(): Promise<LightMedia[]> {
    'use server';
    const apiKey: string = process.env.TMDB_KEY ?? "";
    console.log("TMDB_KEY", apiKey);

    const url = 'https://api.themoviedb.org/3/movie/popular?language=fr&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    const res = await fetch(url, options);

    if (!res.ok) {
        throw res.status;
    }

    const data = await res.json();

    const mediaList: LightMedia[] = [];
    for (const item of data.results) {
        if (item.poster_path && item.release_date) {
            mediaList.push(parseLightMedia(item, MediaType.MOVIE));
        }
    }

    return mediaList;
}

export async function getMediaDetails(tmdbId: string, lang: string = "fr") {
    'use server';
    try {
        return await getMovieDetailsFromTmdb(tmdbId, lang);
    } catch (error) {
        if (error === 404) {
            return await getTvDetailsFromTmdb(tmdbId, lang);
        } else {
            throw error; // Re-throw other errors
        }
    }
}

export async function getMovieDetailsFromTmdb(tmdbId: string, lang: string = "fr"): Promise<Media> {
    'use server';

    const apiKey: string = process.env.TMDB_KEY ?? "";

    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?language=${lang}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    const res = await fetch(url, options)

    if (!res.ok) throw res.status;

    const data = await res.json();

    return {
        type: MediaType.MOVIE,
        title: data.title,
        year: data.release_date.split('-')[0],
        posterUrl: data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "",
        backdropUrl: "https://image.tmdb.org/t/p/w1280" + data.backdrop_path,
        genres: data.genres.map((genre: { name: string }) => genre.name),
        imdbId: data.imdb_id,
        vo: data.original_language,
        overview: data.overview,
        runtime: parseFloat(data.runtime),
        vote: data.vote_average,
        voteCount: data.vote_count,
        tmdbId: tmdbId,
    }

}

export async function getTvDetailsFromTmdb(tmdbId: string, lang: string = "fr"): Promise<Media> {
    'use server';

    const apiKey: string = process.env.TMDB_KEY ?? "";

    const url = `https://api.themoviedb.org/3/tv/${tmdbId}?language=${lang}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    const res = await fetch(url, options)

    if (!res.ok) throw res.status;

    const data = await res.json();

    return {
        type: MediaType.SHOW,
        title: data.name,
        year: data.first_air_date.split('-')[0],
        posterUrl: data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "",
        backdropUrl: "https://image.tmdb.org/t/p/w1280" + data.backdrop_path,
        genres: data.genres.map((genre: { name: string }) => genre.name),
        imdbId: data.external_ids?.imdb_id,
        vo: data.original_language,
        overview: data.overview,
        runtime: parseFloat(data.episode_run_time[0]),
        vote: data.vote_average,
        voteCount: data.vote_count,
        tmdbId: tmdbId,
    }
}

export async function searchMedia(queryString: string): Promise<LightMedia[]> {

    const apiKey: string = process.env.TMDB_KEY ?? "";

    const movieUrl = `https://api.themoviedb.org/3/search/tv?query=${queryString}&include_adult=false&language=fr`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?query=${queryString}&include_adult=false&language=fr`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    const movieRes = await fetch(movieUrl, options);
    const tvRes = await fetch(tvUrl, options);

    if (!movieRes.ok) {
        throw movieRes.status;
    }

    if (!tvRes.ok) {
        throw tvRes.status;
    }

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();
    const mediaList: LightMedia[] = [];

    for (const item of movieData.results) {
        if (item.poster_path && item.release_date) {
            mediaList.push(parseLightMedia(item, MediaType.MOVIE));
        }
    }

    for (const item of tvData.results) {
        console.log(item)
        if (item.poster_path && item.first_air_date) {
            mediaList.push(parseLightMedia(item, MediaType.SHOW));
        }
    }

    return mediaList
}