export default async function tasfSearchLinkTv(tmdbId, season, episode) {
    const url = `https://theyallsayflix.su/api/v1/search?type=show&tmdb_id=${tmdbId}&season${season}&episode=${episode}`;
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
        if (!links.some(item => item.quality === stream.quality) && !stream.play_url.toString().endsWith("3D")) {
            links.push({
                quality: stream.quality,
                link: "https://theyallsayflix.su" + stream.play_url
            });
        }
    }

    return links;
}