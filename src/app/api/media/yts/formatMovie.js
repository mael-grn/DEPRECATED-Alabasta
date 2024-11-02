import Media from "@/app/model/media";
import getMagnetLink from "@/app/api/media/yts/getMagnetLink";

export default async function formatMovie(rawMovieData) {
    let name = rawMovieData.item.name.replace(/\(\d{4}\)/, "").trim()
    let url = rawMovieData.item.url
    let movie = new Media(name, "yts", url)
    const yearMatch = rawMovieData.item.name.match(/\((\d{4})\)/);
    movie.year = yearMatch ? yearMatch[1] : null;
    movie.imageUrl = rawMovieData.item.image
    movie.qualitiesLinks = await getMagnetLink(url);

    return movie;
}