
import {NextResponse} from "next/server";
import {getPopularMovies} from "@/app/utils/tmdbUtil";
import HomeMediaLists from "@/app/models/homeMediaLists";

export async function GET() {

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