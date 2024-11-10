import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
        const {token, id} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { rows } = await sql`
            SELECT * FROM watch_list WHERE id = ${userId} AND imdbid = ${id};
            `;

        if (rows.length > 0) {
            return new Response(JSON.stringify({ message: 'already in watch list' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await sql`
            INSERT INTO watch_list VALUES (${userId}, ${id})
            `;

        return new Response(JSON.stringify({ message: 'added'}), {
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