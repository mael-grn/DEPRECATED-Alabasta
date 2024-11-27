
import authenticateToken from "@/app/api/authenticateToken";
import {sql} from "@vercel/postgres";
export const dynamic = 'force-dynamic';

/**
 * get progress of a movie
 * @param req
 * @param params
 * @returns {Promise<Response>}
 * @constructor
 */
export async function GET(req, { params }) {
    try {
        const {mediaId, season, episode} = params;
        const token = req.headers.get('Authorization');
        if (!token) {
            return new Response(JSON.stringify({error: "Missing or invalid Authorization header"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'},
            });
        }
        const userId = await authenticateToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // check if season and episode are numbers
        if (season && episode && (isNaN(season) || isNaN(episode))) {
            return new Response(JSON.stringify({message: 'season and episode must be numbers'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        // get progress, if season and episode are provided, get progress of that episode, otherwise get progress of the movie
        const {rows} = (season && episode) ?
            await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${mediaId} AND season = ${parseInt(season)} AND episode = ${parseInt(episode)};
        ` :
            await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${mediaId};
        `
        console.log("season and episode  : ", season, episode);
        console.log("query : ", `
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${mediaId};
        `);
        console.log("rows : ", rows);
        if (!rows || rows.length === 0) {
            return new Response(JSON.stringify({res: 0}), {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({res: rows[0].progress}), {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}