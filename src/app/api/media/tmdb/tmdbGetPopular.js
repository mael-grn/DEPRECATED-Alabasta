import Media from "@/app/model/media";

export default async function tmdbGetPopular() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=fr&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };

    const res = await fetch(url, options);
    const data = await res.json();

    const mediaList = [];
    for (const item of data.results) {
        const media = new Media(item.id, item.title);
        media.year = item.release_date.split('-')[0];
        media.poster = item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : "";
        media.popularity = item.popularity;
        media.type = "movie";
        mediaList.push(media);
    }

    return mediaList;
}