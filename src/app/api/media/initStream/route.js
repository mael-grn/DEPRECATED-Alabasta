import jwt from 'jsonwebtoken';
import ytsInitStream from "@/app/api/media/yts/ytsInitStream";
import authenticateToken from "@/app/api/authenticateToken";

export async function POST(req) {
    try {
        const { torrentUrl, token } = await req.json();
        const userId = await authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const streamId = await ytsInitStream(torrentUrl, userId);

        return new Response(JSON.stringify({ streamId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Server error: ' + error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


