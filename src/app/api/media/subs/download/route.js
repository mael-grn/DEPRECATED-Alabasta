
import jwt from 'jsonwebtoken';
import ytsSearch from "@/app/api/media/yts/search";
import authenticateToken from "@/app/api/authenticateToken";
import {deleteOSToken, getOSToken} from "@/app/api/media/subs/OSToken";

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { subsId, token } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const osToken = await getOSToken();
        if (!osToken) {
            return new Response(JSON.stringify({ message: 'server error : unable to connect to open subtitle' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(subsId);
        console.log(osToken);

        const response = await fetch('https://api.opensubtitles.com/api/v1/download', {
            method: 'POST',
            headers: {
                'Api-Key': "W9xgGQq7r2d7gB9jt8HxnK7xBMt7hpIY",
                'Authorization': `Bearer ${osToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_id: subsId
            })
        });

        if (!response.ok) {
            await deleteOSToken();
            return new Response(JSON.stringify({ message: 'server error', error: response.status }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify({ subsLink: data.link }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        await deleteOSToken();
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}