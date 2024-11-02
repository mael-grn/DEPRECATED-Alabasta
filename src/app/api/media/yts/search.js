import Media from "@/app/model/media";
import getMagnetLink from "@/app/api/media/yts/getMagnetLink";
import formatMovie from "@/app/api/media/yts/formatMovie";

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
                    const movie = await formatMovie(rawMovie);
                    movieList.push(movie);
                }
            }
        }
    }

    return movieList;

}