import getFinalUrl from "@/app/api/getFinalUrl";

export default async function tasfSearchLinkTv(tmdbId, season, episode) {
    const url = `https://theyallsayflix.su/api/v1/search?type=show&tmdb_id=${tmdbId}&season=${season}&episode=${episode}`;
    console.log("url ", url)
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };
    const res = await fetch(url, options)
    const data = await res.json();
    console.log("data ", data)
    if (data.streams === null || data.streams.length === 0) return null;

    const links = [];

    for (const stream of data.streams) {
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
                links.push({
                    quality: quality,
                    link: finalLink,
                });
            }
        }
    }

    return links;
}