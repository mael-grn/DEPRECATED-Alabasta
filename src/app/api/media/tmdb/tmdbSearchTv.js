import Media from "@/app/model/media";

export default async function tmdbSearchTv(queryString) {
    let url = `https://api.themoviedb.org/3/search/tv?query=${queryString}&include_adult=false&language=fr`

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
        }
    };
    let mediaList = [];
    const tvRes = await fetch(url, options);
    const tvData = await tvRes.json();
    for (const item of tvData.results) {
        const media = new Media(item.id, item.name);
        media.year = item.first_air_date.split('-')[0];
        media.poster = "https://image.tmdb.org/t/p/w500" + item.poster_path;
        media.popularity = item.popularity;
        media.type = "tv";
        mediaList.push(media);
    }

    return mediaList;
}