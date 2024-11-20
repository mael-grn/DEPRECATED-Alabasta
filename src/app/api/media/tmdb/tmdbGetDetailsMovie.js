import Media from "@/app/model/media";

export default async function tmdbGetDetailsMovie(id, lang="fr") {
    if (!id) return null;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=${lang}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };

    const res = await fetch(url, options)
    const data = await res.json();

    try {
        const media = new Media(id, data.title);
        media.type = "movie";
        media.year = data.release_date.split('-')[0];
        media.date = data.release_date;
        media.poster = data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "";
        media.backdrop = "https://image.tmdb.org/t/p/w1280" + data.backdrop_path;
        media.qualitiesLinks = [];
        media.genres = data.genres.map((genre) => genre.name);
        media.imdbId = data.imdb_id;
        media.language = data.original_language;
        media.overview = data.overview;
        media.country = data.production_countries.map((country) => country.name);
        media.runtime = data.runtime;
        media.status = data.status;
        media.vote = data.vote_average;
        media.voteCount = data.vote_count;
        media.popularity = data.popularity;

        return media
    } catch (e) {
        return null;
    }
}