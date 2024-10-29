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

        const { token } = await req.json();

        const secretKey = process.env.AUTH_SECRET

        const decoded = jwt.verify(token, secretKey);

        if (!decoded) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch(`https://yts.rs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const html = await response.text();

        const jsonMatches = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g);

        if (jsonMatches) {
            for (const match of jsonMatches) {
                const jsonString = match.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1];

                try {
                    const jsonData = JSON.parse(jsonString);

                    // Vérifiez si le JSON contient "@type": "ItemList"
                    if (jsonData["@type"] === "ItemList") {
                        console.log(jsonData);

                        return new Response(JSON.stringify({ data: jsonData }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    }
                } catch (error) {
                    return new Response(JSON.stringify({ message: "impossible de convertir en json" }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
        }

        return new Response(JSON.stringify({ message: "aucun json trouvé" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}