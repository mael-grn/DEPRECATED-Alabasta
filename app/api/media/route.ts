
import {NextResponse} from "next/server";
import {getPopularMovies, searchMedia} from "@/app/utils/tmdbUtil";
import HomeMediaLists from "@/app/models/homeMediaLists";

export async function GET(request: Request) {

    const {searchParams} = new URL(request.url);
    const query = searchParams.get('q');

    if (query) {
        const medias = await searchMedia(query);
        return NextResponse.json(medias, {status: 200});
    }

    try {
        const medias = await getPopularMovies();
        const mediaLists : HomeMediaLists = {
            popularMovies: medias
        }
        return NextResponse.json(mediaLists, {status: 200});
    } catch (error) {
        const code: number =  isNaN(error as number) ? 500 : error as number;
        return NextResponse.json((""), {status: code});
    }
}