import {getItem, setItem} from "@/app/utils/cookiesUtils";



export const saveMovieData = async (movie) => {
    await setItem(movie.id, JSON.stringify(movie));
}

export const recoverMovieData = async (id) => {
    let movie;
    try {
        let item = await getItem(id);
        movie = JSON.parse(item.toString());
    } catch (e) {
        return null;
    }
    return movie;
}