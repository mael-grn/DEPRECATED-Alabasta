
import jwt from 'jsonwebtoken';
import authenticateToken from "@/app/api/authenticateToken";
import {deleteOSToken, getOSToken} from "@/app/api/subs/openSubtitle/OSToken";
import openSubtitleDownload from "@/app/api/subs/openSubtitle/openSubtitleDownload";

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

        const subs = await openSubtitleDownload(subsId);

        if (!subs) {
            return new Response(JSON.stringify({ error: "impossible to download subtitles from open subtitle" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ res: subs }), {
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

