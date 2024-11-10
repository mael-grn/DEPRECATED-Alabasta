import Media from "@/app/model/media";

export default async function omdbSearch(searchValue, year = null) {

    const targetUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${searchValue.replace(/ /g, '+')}${year ? `&y=${year}` : ''}`;

    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const json = await response.json();
    if (json.Response === "False" || !json.imdbID || json.imdbID === "" || json.imdbID === "N/A") {
        return null;
    }

    const media = new Media(json.Title, "", "");

    media.title = json.Title;
    media.poster = json.Poster === "N/A" ? media.poster : json.Poster;
    media.year = json.Year;
    media.runtime = json.Runtime;
    media.genre = json.Genre;
    media.director = json.Director;
    media.writer = json.Writer;
    media.actors = json.Actors?.split(", ");
    media.plot = json.Plot;
    media.awards = json.Awards;
    media.country = json.Country;
    media.ratings = json.Ratings;
    media.type = json.Type;
    media.imdbID = json.imdbID;
    media.imdbRating = json.imdbRating;
    media.imdbVotes = json.imdbVotes

    return media;
}