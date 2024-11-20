import Media from "@/app/model/media";

export default async function tmdbSearchMovie(queryString) {

    let url = `https://api.themoviedb.org/3/search/movie?query=${queryString}&include_adult=false&language=fr`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };

    const movieRes = await fetch(url, options);
    const movieData = await movieRes.json();
    const mediaList = [];

    for (const item of movieData.results) {
        const media = new Media(item.id, item.title);
        media.year = item.release_date.split('-')[0];
        media.poster = item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : "";
        media.popularity = item.popularity;
        media.type = "movie";
        mediaList.push(media);
    }

    return mediaList;
}