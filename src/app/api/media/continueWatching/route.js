
import authenticateToken from "@/app/api/authenticateToken";
import {sql} from "@vercel/postgres";
import tmdbGetDetailsTv from "@/app/api/media/tmdb/tmdbGetDetailsTv";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
export const dynamic = 'force-dynamic';

/**
 * Get the list of media that the user has started but not finished
 * @param req
 * @returns {Promise<Response>}
 * @constructor
 */
export async function POST(req) {
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

        // Get the list of tmdbId that the user has started but not finished
        const {rows} = await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND progress < (media_max_length - 300) ORDER BY last_watched DESC;
        `;

        const mediaLst = []
        // Get the details of each medias from imdbId
        for (const element of rows) {
            // If the media is a tv show, get the details of the tv show
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