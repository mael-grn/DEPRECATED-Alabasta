
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetNowPlaying from "@/app/api/media/tmdb/tmdbGetNowPlaying";
import {sql} from "@vercel/postgres";
import tmdbGetDetailsSeason from "@/app/api/media/tmdb/tmdbGetDetailsSeason";
import tmdbGetDetailsTv from "@/app/api/media/tmdb/tmdbGetDetailsTv";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
export const dynamic = 'force-dynamic';

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { token } = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const {rows} = await sql`
            SELECT * FROM started_not_finished WHERE user_id = ${userId};
        `;

        console.log(rows)

        const mediaLst = []
        for (const element of rows) {
            if (element.season && element.episode) {
                const media = await tmdbGetDetailsTv(element.movie_id)
                mediaLst.push(media)
            } else {
                const media = await tmdbGetDetailsMovie(element.movie_id)
                mediaLst.push(media)
            }
        }

        return new Response(JSON.stringify({ res: mediaLst }), {
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