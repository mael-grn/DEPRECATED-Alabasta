import { sql } from '@vercel/postgres';
import authenticateToken from "@/app/api/authenticateToken";

/**
 * Route to check if a movie or show is in the user's watch list
 * @param req
 * @returns {Promise<Response>}
 * @constructor
 */
export async function POST(req) {
    try {
        // extraction des données de la requête
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong cookies with the query. expected token' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const {token, id, type} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const { rows } = await sql`
            SELECT * FROM watch_list WHERE id = ${userId} AND tmdbid = ${id} AND type = ${type};
            `;

        const isInWatchList = rows.length > 0;

        return new Response(JSON.stringify({ res: isInWatchList}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}