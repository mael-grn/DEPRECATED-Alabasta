
import {sql} from "@vercel/postgres";
import {deleteOSToken, getOSToken} from "@/app/api/media/subs/OSToken";

export async function GET(req, { params }) {
    try {

        const {imdb} = params;

        const res = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdb}`, {
            method: 'GET',
            headers: {
                'Api-Key': process.env.OPEN_SUBS_API_KEY,
                'User-Agent': 'Alabasta v0.1'
            }
        })

        if (!res.ok) {
            return new Response(JSON.stringify({message: 'server error', error: `Error: ${res.status}`}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const data = await res.json();
        const subsLst = data.data.filter(item => item.attributes.language === "fr");

        const highestDownloadCountSubtitle = subsLst.reduce((max, item) => {
            return (item.attributes.download_count > max.attributes.download_count) ? item : max;
        }, subsLst[0]);

        return new Response(JSON.stringify({subsId: highestDownloadCountSubtitle.attributes.files[0].file_id}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });


    } catch (e) {
        return new Response(JSON.stringify({message: 'server error', error: e.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}
