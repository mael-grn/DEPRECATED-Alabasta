import peerflix from 'peerflix';
import {sql} from "@vercel/postgres";
export const dynamic = 'force-dynamic';

// Fonction GET pour servir le flux vidéo avec support des Range
export async function GET(req, { params }) {
    try {

        const {streamId} = params;

        const { rows } = await sql`
            SELECT * FROM streaming_url WHERE streamId = ${streamId};
            `;


        if (rows.length === 0) {
            return new Response(JSON.stringify({message: 'Stream not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        } else if (rows.length > 1) {
            return new Response(JSON.stringify({message: 'Multiple streams found'}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const torrentUrl = rows[0].torrenturl;


        const engine = peerflix(torrentUrl, {});


        const stream = await new Promise((resolve, reject) => {
            engine.on('ready', () => {
                const file = engine.files.find(f => f.name.endsWith('.mp4'));
                if (!file) {
                    engine.destroy();
                    reject(new Response(JSON.stringify({message: 'No video file found'}), {
                        status: 404,
                        headers: {'Content-Type': 'application/json'},
                    }));
                }
                resolve(file);
            });

            engine.on('error', (error) => {
                engine.destroy();
                reject(new Response(JSON.stringify({message: 'Error streaming video: ' + error}), {
                    status: 500,
                    headers: {'Content-Type': 'application/json'},
                }));
            });
        });

        const range = req.headers.get('range');
        const fileSize = stream.length;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const fileStream = stream.createReadStream({start, end});
            return new Response(fileStream, {
                status: 206,
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4',
                },
            });
        } else {
            // Diffusion sans requête "Range" (lecture depuis le début)
            return new Response(stream.createReadStream(), {
                headers: {
                    'Content-Type': 'video/mp4',
                    'Content-Length': fileSize,
                },
            });
        }
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({message: 'server error', error: e.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}
