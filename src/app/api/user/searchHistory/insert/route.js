import { sql } from '@vercel/postgres';
import authenticateToken from "@/app/api/authenticateToken";

export async function POST(req, res) {
    try {
        // extraction des données de la requête
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong cookies with the query. expected token' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const {query, token} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { rows } = await sql`
            SELECT * FROM user_history WHERE user_id = ${userId} AND search_query = ${query};
            `;

        if (rows.length === 0) {
            await sql`
                INSERT INTO user_history (user_id, search_query) VALUES (${userId}, ${query});
                `;
        }

            return new Response(JSON.stringify({res: true}), {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}