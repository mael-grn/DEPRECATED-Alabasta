
import {sql} from "@vercel/postgres";

export async function GET(req, { params }) {
    try {

        const {imdb} = params;

        const ApiKey = "";


        const res = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdb}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Alabasta v0.1',
                'Api-Key': ApiKey,
            },
        });

        if (!res.ok) {
            return new Response(JSON.stringify({message: 'server error', error: `Error: ${res.status}`}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const data = await res.json();

        return new Response(JSON.stringify({data: data}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });


    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({message: 'server error', error: e.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}
