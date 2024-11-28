
import openSubtitleSearch from "@/app/api/subs/openSubtitle/openSubtitleSearch";

/**
 * Search for subtitles on opensubtitles
 * @param req
 * @param params
 * @returns {Promise<Response>}
 * @constructor
 */
export async function GET(req, { params }) {
    try {

        const {tmdb, season, episode} = params;

        const subsLst = await openSubtitleSearch(tmdb, season, episode)

        if (!subsLst) {
            return new Response(JSON.stringify({error: "impossible to get subtitles"}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({res: subsLst}), {
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
