import tasfSearchLinkMovie from "@/app/api/media/tasf/tasfSearchLinkMovie";
import authenticateToken from "@/app/api/authenticateToken";
import tasfSearchLinkTv from "@/app/api/media/tasf/tasfSearchLinkTv";

/**
 * search link for media streaming
 * @param req
 * @returns {Promise<Response>}
 * @constructor
 */
export async function POST(req) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { mediaId, season, episode, token } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // if season and episode are provided, search for tv show, else search for movie
        let res
        if (season && episode) {
            res = await tasfSearchLinkTv(mediaId, season, episode);
        } else {
            res = await tasfSearchLinkMovie(mediaId);
        }

        return new Response(JSON.stringify({res: res}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `server error: ${error}`}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
