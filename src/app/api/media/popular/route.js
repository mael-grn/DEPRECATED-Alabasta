import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ytsPopular from "@/app/api/media/yts/popular";
import authenticateToken from "@/app/api/authenticateToken";
import getDetails from "@/app/api/media/omdb/getDetails";

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { token } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const popular = await ytsPopular();
        const updatedPopular = [];
        for (const movie of popular) {
            updatedPopular.push(await getDetails(movie));
        }

        return new Response(JSON.stringify({ movies: updatedPopular }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}