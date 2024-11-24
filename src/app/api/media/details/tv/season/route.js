
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetNowPlaying from "@/app/api/media/tmdb/tmdbGetNowPlaying";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
import tmdbGetDetailsTv from "@/app/api/media/tmdb/tmdbGetDetailsTv";
import {sql} from "@vercel/postgres";
import tmdbGetDetailsSeason from "@/app/api/media/tmdb/tmdbGetDetailsSeason";
export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { tvId, season, token } = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const detailedSeason = await tmdbGetDetailsSeason(tvId, season);

        return new Response(JSON.stringify({ res: detailedSeason }), {
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