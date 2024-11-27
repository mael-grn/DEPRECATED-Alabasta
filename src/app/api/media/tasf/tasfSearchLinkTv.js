import getFinalUrl from "@/app/api/getFinalUrl";
import tmdbGetDetailsSeason from "@/app/api/media/tmdb/tmdbGetDetailsSeason";

/**
 * Search for links of a tv show on TheyAllSayFlix
 * @param tmdbId
 * @param season
 * @param episode
 * @returns {Promise<*[]>}
 */
export default async function tasfSearchLinkTv(tmdbId, season, episode) {
    const url = `https://theyallsayflix.su/api/v1/search?type=show&tmdb_id=${tmdbId}&season=${season}&episode=${episode}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };
    const res = await fetch(url, options)
    const data = await res.json();

    const links = [];

    for (const stream of data.streams) {
        //if the quality is not already in the list and the link is not a 3D link
        if (!links.some(item => item.quality === stream.quality) && !stream.play_url.toString().endsWith("3D")) {
            const finalLink = await getFinalUrl(stream.play_url);
            if (finalLink) {
                let quality;
                switch (stream.quality) {
                    case "2160p":
                    case 2160:
                        quality = "4K";
                        break;
                    case "1080p":
                    case 1080:
                        quality = "HD";
                        break;
                    case "720p":
                    case 720:
                        quality = "SD";
                        break;
                    default:
                        quality = stream.quality;
                        break;

                }
                //add the link to the list, replace the download link by the API proxy link to avoid cors errors
                links.push({
                    quality: quality,
                    link: finalLink.replace(new RegExp('^' + "http://theyallsayflix.su:8081/download/"), "/api/media/tasf/"),
                });
            }
        }
    }

    if (links.length === 0) fetchAllSeasons(tmdbId, season);

    return links;
}

export const fetchAllSeasons = async (tmdbId, seasonId) => {
    const seasonData = await tmdbGetDetailsSeason(tmdbId, seasonId);
    let i = 1;
    for (const item of seasonData.children) {
        const url = `https://theyallsayflix.su/api/v1/search?type=show&tmdb_id=${tmdbId}&season=${seasonId}&episode=${i}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        await fetch(url, options);
        i++;
    }
}