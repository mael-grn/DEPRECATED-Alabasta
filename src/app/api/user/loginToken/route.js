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
        const {token} = await req.json();

        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const { rows } = await sql`
            SELECT * FROM users WHERE id = ${userId};
            `;

        if (rows.length !== 1) {
            return new Response(JSON.stringify({ message: 'user not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });

        } else {

            const secretKey = process.env.AUTH_SECRET;
            const token = jwt.sign({ key: userId }, secretKey, { expiresIn: '1h' });
            return new Response(JSON.stringify({ message: 'good token', res: {user: rows[0], token: token }}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}