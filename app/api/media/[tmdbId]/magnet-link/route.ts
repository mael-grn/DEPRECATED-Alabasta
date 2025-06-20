
import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {InsertableTmdbMagnetLink} from "@/app/models/tmdbMagnetLink";
import {getYtsMagnetLinks} from "@/app/utils/ytsUtil";
import {Media} from "@/app/models/media";
import {getMediaDetails} from "@/app/utils/tmdbUtil";

export async function GET(request: Request, { params }: { params: Promise<{ tmdbId: string }> }) {

    const { tmdbId } = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    if (search && search.toLowerCase() === "true") {
        let media : Media
        let magnetLink: InsertableTmdbMagnetLink[]
        try {
            media = await getMediaDetails(tmdbId);
            magnetLink = await getYtsMagnetLinks(media);
        } catch (e) {
            return NextResponse.json({message: "Error fetching magnet links"}, {status: e as number || 500});
        }


        if (magnetLink.length > 0) {
            for (const link of magnetLink) {
                await sql`
                INSERT INTO tmdb_magnet_links (tmdb_id, magnet_link, quality, language, source)
                VALUES (${tmdbId}, ${link.magnet_link}, ${link.quality}, ${link.language}, ${link.source})
                ON CONFLICT (magnet_link)
                    DO UPDATE SET
                                  quality = EXCLUDED.quality,
                                  language = EXCLUDED.language,
                                  source = EXCLUDED.source
            `;
            }

        }
    }


    const res = await sql`SELECT * FROM tmdb_magnet_links WHERE tmdb_id = ${tmdbId}`;
    if (res.length > 0) {
        return NextResponse.json(res, {status: 200});
    } else {
        return NextResponse.json({message: "No magnet link found for this TMDB ID"}, {status: 404});
    }
}