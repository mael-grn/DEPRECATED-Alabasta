import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetDetails from "@/app/api/media/tmdb/tmdbGetDetails";

export async function POST(req, res) {
    try {
        // extraction des données de la requête
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong cookies with the query. expected token' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const {token} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const { rows } = await sql`
            SELECT * FROM watch_list WHERE id = ${userId};
            `;

        const list = [];

        for (const row of rows) {
            const media = await tmdbGetDetails(row.imdbid)
            list.push(media);
        }
        return new Response(JSON.stringify({ res: list}), {
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