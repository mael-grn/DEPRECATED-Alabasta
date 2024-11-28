import authenticateToken from "@/app/api/authenticateToken";
import {sql} from "@vercel/postgres";

/**
 * Set the progress of a user on a media
 * @param req
 * @returns {Promise<Response>}
 * @constructor
 */
export async function POST(req) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({message: 'wrong data in the query'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const {mediaId, progress, media_length, season, episode, token} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({message: 'wrong token'}), {
                status: 401,
                headers: {'Content-Type': 'application/json'},
            });
        }

        // Check if the media exists in the user_progress table
        const {rows} = await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${mediaId};
        `;
        const currentDate = new Date().toISOString(); // Format YYYY-MM-DDTHH:mm:ss.sssZ

        // If the media exists, update the progress
        if (rows && rows.length > 0) {
            // If season and episode are provided, update them
            if (season && episode) {
                await sql`
            UPDATE user_progress 
            SET 
                progress = ${progress}, 
                season = ${season}, 
                episode = ${episode}, 
                media_max_length = ${media_length}, 
                last_watched = ${currentDate} 
            WHERE 
                user_id = ${userId} AND 
                movie_id = ${mediaId};
        `;
            } else {
                await sql`
            UPDATE user_progress 
            SET 
                progress = ${progress}, 
                media_max_length = ${media_length}, 
                last_watched = ${currentDate} 
            WHERE 
                user_id = ${userId} AND 
                movie_id = ${mediaId};
        `;
            }
        }
        else {
            if (season && episode) {
                await sql`
                    INSERT INTO user_progress(user_id, movie_id, progress, season, episode, media_max_length, last_watched) VALUES (${userId}, ${mediaId}, ${progress}, ${season}, ${episode}, ${media_length}, ${currentDate});
            `;
            } else {
                await sql`
                INSERT INTO user_progress(user_id, movie_id, progress, media_max_length, last_watched) VALUES (${userId}, ${mediaId}, ${progress}, ${media_length}, ${currentDate});
            `;
            }
        }

        return new Response(JSON.stringify({res: true}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });

    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}

