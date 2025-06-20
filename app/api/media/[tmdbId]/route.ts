
import {NextResponse} from "next/server";
import {getMediaDetails} from "@/app/utils/tmdbUtil";

export async function GET(request: Request, { params }: { params: Promise<{ tmdbId: string }> }) {

    const { tmdbId } = await params;

    try {
        const media = await getMediaDetails(tmdbId);
        return NextResponse.json(media, {status: 200});
    } catch (error) {
        const code: number =  isNaN(error as number) ? 500 : error as number;
        return NextResponse.json((""), {status: code});
    }
}