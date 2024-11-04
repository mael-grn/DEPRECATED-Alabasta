export default async function getDetails(media) {

    const targetUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${media.title.replace(/ /g, '+')}&y=${media.year}`;
    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const json = await response.json();

    media.title = json.Title;
    media.poster = json.Poster;
    media.year = json.Year;
    media.runtime = json.Runtime;
    media.genre = json.Genre;
    media.director = json.Director;
    media.writer = json.Writer;
    media.actors = json.Actors;
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