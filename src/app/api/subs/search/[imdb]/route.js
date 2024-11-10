
import openSubtitleSearch from "@/app/api/subs/openSubtitle/openSubtitleSearch";

export async function GET(req, { params }) {
    try {

        const {imdb} = params;

        const subsId = await openSubtitleSearch(imdb)
        if (!subsId) {
            return new Response(JSON.stringify({error: "impossible to get subtitles"}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({res: subsId}), {
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
