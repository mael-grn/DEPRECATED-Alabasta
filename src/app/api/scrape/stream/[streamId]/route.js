import peerflix from 'peerflix';
import { getStream } from "@/app/api/scrape/stream/streamManager";

// Fonction GET pour servir le flux vidéo avec support des Range
export async function GET(req, { params }) {

    console.log("demande de stream")

    try {

        const {streamId} = params;
        const torrentUrl = getStream(streamId);
        if (!torrentUrl) {
            return new Response(JSON.stringify({message: 'Stream not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const engine = peerflix(torrentUrl, {});
        console.log("engine created")


        const stream = await new Promise((resolve, reject) => {
            engine.on('ready', () => {
                console.log('Engine ready, getting file');
                const file = engine.files.find(f => f.name.endsWith('.mp4'));
                if (file) console.log("got file")
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
            console.log('Range request for: ', range);
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const fileStream = stream.createReadStream({start, end});
            console.log('sent range ', ((start - end) / fileSize))
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
