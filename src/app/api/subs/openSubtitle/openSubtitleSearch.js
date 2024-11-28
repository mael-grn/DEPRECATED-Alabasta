import tmdbGetDetailsTv from "@/app/api/media/tmdb/tmdbGetDetailsTv";
import tmdbGetDetailsSeason from "@/app/api/media/tmdb/tmdbGetDetailsSeason";

/**
 * Search for subtitles on opensubtitles
 * filtered by french language
 * @param imdbId
 * @returns {Promise<*|null>}
 */
export default async function openSubtitleSearch(tmdb, season = null, episode = null) {

    let url = `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdb}&languages=fr`;

    if (season && episode) {
        const seasonDetails = await tmdbGetDetailsSeason(tmdb, season);
        console.log(seasonDetails.children)
        console.log(seasonDetails.children.find(media => media.number === parseInt(episode)))
        const episodeId = seasonDetails.children.find(media => media.number === parseInt(episode)).id;
        url = `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${episodeId}&parent_tmdb_id=${tmdb}&languages=fr`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Api-Key': process.env.OPEN_SUBS_API_KEY,
            'User-Agent': 'Alabasta v0.1'
        }
    })

    if (!res.ok) {
        console.error("impossible to fetch opensubtitle : " + res.status)
        return null;
    }

    const data = await res.json();


    // on retourne les file_id par ordre de téléchargement fitrés par la langue française
    return data.data
        .sort((a, b) => b.attributes.download_count - a.attributes.download_count)
        .map((item, index) => ({name: "francais " + (index+1), id: item.attributes.files[0].file_id}));
}