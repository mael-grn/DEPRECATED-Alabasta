import {NextRequest, NextResponse} from "next/server";
import TmdbService from "@/app/services/tmdbService";
import {getMagnetLinks} from "@/app/utils/ytsUtils";
import ErrorType from "@/app/enum/ErrorTypeEnum";

export async function GET(
    req: NextRequest, { params }: { params: Promise<{ tmdbId: string }> }) {
    const { tmdbId } = await params

    if (!tmdbId) {
        return NextResponse.json({ error: 'Le paramètre tmdbId est manquant' }, { status: 400 });
    }

    const tmdbRes = await TmdbService.getMovieDetails(tmdbId);
    if (!tmdbRes.success) {
        return NextResponse.json(tmdbRes.error, {status: 500});
    }

    const movie = tmdbRes.data!;

    const links = await getMagnetLinks(movie.tmdbId);

    if (!links.success) {
        if (links.error === ErrorType.MEDIA_NOT_FOUND) {
            return NextResponse.json({message: links.error?.toString()}, {status: 404});
        }
        return NextResponse.json({message: links.error?.toString()}, {status: 500});
    } else {
        return NextResponse.json({links: links.data});
    }
}