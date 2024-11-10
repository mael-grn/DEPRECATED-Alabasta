import Media from "@/app/model/media";
import ytsMovie from "@/app/api/media/yts/ytsMovie";

/**
 * search movies from yts website
 * @param searchValue the search query
 * @returns {Promise<*[]>} a list of media object
 */
export default async function ytsSearch(searchValue) {
    const targetUrl = `https://yts.rs/browse-movies/${searchValue}/all/all/0/latest`;

    const response = await fetch(targetUrl, {
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

            // Vérifiez si le JSON contient "@type": "ItemList"
            if (jsonData["@type"] === "ItemList") {
                for (const rawMovie of jsonData.itemListElement) {
                    let name = rawMovie.item.name.replace(/\(\d{4}\)/, "").trim()
                    const yearMatch = rawMovie.item.name.match(/\((\d{4})\)/);
                    let year = yearMatch ? yearMatch[1] : null;
                    let movie = new ytsMovie(name, year, rawMovie.item.url, [])
                    movieList.push(movie);
                }
            }
        }
    }

    return movieList;

}