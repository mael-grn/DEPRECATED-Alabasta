
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetNowPlaying from "@/app/api/media/tmdb/tmdbGetNowPlaying";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
import tmdbGetDetailsTv from "@/app/api/media/tmdb/tmdbGetDetailsTv";
import {sql} from "@vercel/postgres";
export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { tvId, token } = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const detailedTv = await tmdbGetDetailsTv(tvId);

        const {rows} = await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${tvId};
        `;

        if (rows && rows.length > 0) {
            detailedTv.seasonProgress = rows[0].season;
            detailedTv.episodeProgress = rows[0].episode;
            detailedTv.progress = rows[0].progress;
        }

        return new Response(JSON.stringify({ res: detailedTv }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}