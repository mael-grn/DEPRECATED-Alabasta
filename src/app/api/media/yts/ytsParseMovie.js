import Media from "@/app/model/media";
import ytsGetMagnetLink from "@/app/api/media/yts/ytsGetMagnetLink";

/**
 * Format movies from yts into media object
 * @param rawMovieData movie data from queries to yts
 * @returns {Promise<Media>} media object
 */
export default async function ytsParseMovie(rawMovieData) {

    return rawMovieData;
}