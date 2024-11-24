
import authenticateToken from "@/app/api/authenticateToken";
import {sql} from "@vercel/postgres";

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { mediaId, progressPercent, season, episode, token } = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const {rows} = await sql`
            SELECT * FROM user_progress WHERE user_id = ${userId} AND movie_id = ${mediaId};
        `;

        if (rows && rows.length > 0) {
            if (season && episode) {
                await sql`
                UPDATE user_progress SET progress = ${progressPercent}, season = ${season}, episode = ${episode} WHERE user_id = ${userId} AND movie_id = ${mediaId};
            `;
            } else {
                await sql`
                UPDATE user_progress SET progress = ${progressPercent} WHERE user_id = ${userId} AND movie_id = ${mediaId};
            `;
            }

        } else {
            if (season && episode) {
                await sql`
                    INSERT INTO user_progress(user_id, movie_id, progress, season, episode) VALUES (${userId}, ${mediaId}, ${progressPercent}, ${season}, ${episode});
            `;
            } else {
                await sql`
                INSERT INTO user_progress(user_id, movie_id, progress) VALUES (${userId}, ${mediaId}, ${progressPercent});
            `;
            }
        }

        return new Response(JSON.stringify({ res: true }), {
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

