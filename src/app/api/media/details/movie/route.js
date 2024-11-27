
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
import {sql} from "@vercel/postgres";
export const dynamic = 'force-dynamic';

/**
 * Get the details of a movie from the TMDB API
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
        const { movieId, token } = await req.json();
        const userId = await authenticateToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get the details of the movie
        const detailedMovie = await tmdbGetDetailsMovie(movieId);

        // Get the progress of the user for this movie
        const {rows} = await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${movieId};
        `;

        // Add the progress to the movie details
        if (rows && rows.length > 0) {
            detailedMovie.progress = rows[0].progress;
        }

        return new Response(JSON.stringify({ res: detailedMovie }), {
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