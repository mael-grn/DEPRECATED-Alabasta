
import formatMovie from "@/app/api/media/yts/formatMovie";

/**
 * Fetches the popular movies from YTS.
 * @returns {Promise<any>}
 */
export default async function ytsPopular() {
    const response = await fetch(`https://yts.rs/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const html = await response.text();

    const jsonMatches = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g);
    let movieList = [];
    if (jsonMatches) {
        for (const match of jsonMatches) {
            const jsonString = match.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1];

            const jsonData = JSON.parse(jsonString);

            if (jsonData["@type"] === "ItemList") {
                for (const rawMovie of jsonData.itemListElement) {
                    const movie = await formatMovie(rawMovie);
                    movieList.push(movie);
                }
            }
        }
    }
    return movieList;
}