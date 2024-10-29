import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { movieId: movieUrl, token } = await req.json();

        const secretKey = process.env.AUTH_SECRET;

        const decoded = jwt.verify(token, secretKey);

        if (!decoded) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const response = await fetch(movieUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const html = await response.text();

        // Regex pour récupérer tous les liens magnet et leur qualité
        const magnetLinks = [];
        const regex = /<a href="(magnet:\?xt=urn:btih:[^"]+)"[^>]*>\s*<img src="images\/magnet\.svg"[^>]*>\s*<!-- -->\s*([^<]+)<\/a>/g;

        let match;
        while ((match = regex.exec(html)) !== null) {
            const magnetLink = match[1]; // Lien magnet
            const quality = match[2].trim(); // Qualité (ex. 720p, 1080p)
            magnetLinks.push({ magnetLink, quality });
        }

        if (magnetLinks.length > 0) {
            return new Response(JSON.stringify({ data: magnetLinks }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: "aucun lien magnet trouvé" }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'server error : ' + error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
