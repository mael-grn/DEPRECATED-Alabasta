import Media from "@/app/model/media";

/**
 * Get details of a season from TMDB
 * @param tvId
 * @param seasonId
 * @param lang
 * @returns {Promise<Media|null>}
 */
export default async function tmdbGetDetailsSeason(tvId, seasonId, lang="fr") {

    const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonId}?language=${lang}`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };

    const res = await fetch(url, options)
    const data = await res.json();
    // Check if the season exists and parse it
    try {
        const media = new Media(data.id, data.name);
        media.type = "season";
        media.parentId = tvId;
        media.number = data.season_number;
        if (data.air_date) {
            media.year = data.air_date.split('-')[0];
        }
        media.poster = data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "";
        media.backdrop = "https://image.tmdb.org/t/p/w1280" + data.backdrop_path;
        media.qualitiesLinks = [];
        media.overview = data.overview;
        media.vote = data.vote_average;
        media.date = data.air_date;

        for (const item of data.episodes) {
            const episode = new Media(item.id, item.name);
            episode.type = "episode";
            episode.parentId = data.id;
            episode.number = item.episode_number;
            if (item.air_date) {
                episode.year = item.air_date.split('-')[0];
            }
            episode.overview = item.overview;
            episode.vote = item.vote_average;
            episode.poster = "https://image.tmdb.org/t/p/w500" + item.still_path;
            episode.runtime = item.runtime;
            episode.date = item.air_date;
            media.children.push(episode);
        }

        return media
    } catch (e) {
        return null;
    }
}