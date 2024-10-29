import jwt from 'jsonwebtoken';
import peerflix from 'peerflix';
import {addStream} from "@/app/api/scrape/stream/streamManager";

const activeStreams = new Map(); // Pour gérer les sessions actives

export async function POST(req) {
    try {
        const { torrentUrl, token } = await req.json();
        const secretKey = process.env.AUTH_SECRET;
        const decoded = jwt.verify(token, secretKey);

        if (!decoded) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Créer une URL temporaire pour le flux
        const streamId = Date.now().toString(); // ou un autre identifiant unique
        addStream(streamId, torrentUrl); // Sauvegarder le torrent URL
        return new Response(JSON.stringify({ streamId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'Server error: ' + error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


