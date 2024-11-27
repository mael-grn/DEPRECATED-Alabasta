import Media from "@/app/model/media";

/**
 * Get details of a tv show from TMDB
 * @param tvId
 * @param lang
 * @returns {Promise<Media|null>}
 */
export default async function tmdbGetDetailsTv(tvId, lang="fr") {
    const url = `https://api.themoviedb.org/3/tv/${tvId}?language=${lang}`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };

    const res = await fetch(url, options)
    const data = await res.json();

    // Check if the tv show exists and parse it
    try {
        const media = new Media(data.id, data.name);
        media.type = "tv";
        media.date = data.first_air_date;
        media.parentId = tvId;
        media.number = data.season_number;
        media.year = data.first_air_date.toString().split('-')[0];
        media.poster = data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "";
        media.backdrop = "https://image.tmdb.org/t/p/w1280" + data.backdrop_path;
        media.qualitiesLinks = [];
        media.lastAirDate = data.last_air_date;
        media.overview = data.overview;
        media.vote = data.vote_average;
        media.genres = data.genres.map((genre) => genre.name);
        media.country = data.production_companies.map((company) => company.origin_country);

        for (const item of data.seasons) {
            if (item.season_number === 0) continue;
            const season = new Media(item.id, item.name);
            season.type = "season";
            season.parentId = data.id;
            season.number = item.season_number;
            if (item.air_date) {
                season.year = item.air_date.toString().split('-')[0];
                season.date = item.air_date;
            }
            season.overview = item.overview;
            season.vote = item.vote_average;
            media.children.push(season);
        }

        return media
    } catch (e) {
        return null;
    }
}