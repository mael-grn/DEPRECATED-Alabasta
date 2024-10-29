import peerflix from 'peerflix';
import {getStream} from "@/app/api/scrape/stream/streamManager";


// Fonction GET pour servir le flux vidéo
export async function GET(req, { params }) {
    const { streamId } = params;
    const torrentUrl = getStream(streamId);
    if (!torrentUrl) {
        return new Response(JSON.stringify({ message: 'Stream not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const engine = peerflix(torrentUrl, {});
    const stream = await new Promise((resolve, reject) => {
        engine.on('ready', () => {
            const file = engine.files.find(f => f.name.endsWith('.mp4'));
            if (!file) {
                engine.destroy();
                reject(new Response(JSON.stringify({ message: 'No video file found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }));
            }
            resolve(file.createReadStream());
        });
        engine.on('error', (error) => {
            engine.destroy();
            reject(new Response(JSON.stringify({ message: 'Error streaming video: ' + error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }));
        });
    });

    const readableStream = new ReadableStream({
        start(controller) {
            stream.on('data', (chunk) => controller.enqueue(chunk));
            stream.on('end', () => controller.close());
            stream.on('error', (err) => controller.error(err));
        },
        cancel() {
            engine.destroy();
        },
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'video/mp4',
            'Transfer-Encoding': 'chunked',
        },
    });
}
