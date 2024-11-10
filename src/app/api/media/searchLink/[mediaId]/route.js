import ytsSearch from "@/app/api/media/yts/ytsSearch";
import tmdbSearch from "@/app/api/media/tmdb/tmdbSearch";
import authenticateToken from "@/app/api/authenticateToken";
import ytsGetMagnetLink from "@/app/api/media/yts/ytsGetMagnetLink";
import {getMediaDetails} from "@/app/controller/mediaController";
import tmdbGetDetails from "@/app/api/media/tmdb/tmdbGetDetails";
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {

        const {mediaId} = params;

        const token = req.headers.get('Authorization');

        if (!token) {
            return new Response(JSON.stringify({error: "Missing or invalid Authorization header"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const media = await tmdbGetDetails(mediaId, "en-US");
        if (!media) {
            return new Response(JSON.stringify({error: "media with id " + mediaId + " not found"}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const ytsRes = await ytsSearch((media.title))

        let ytsLinks;
        if (!ytsRes || ytsRes.length !== 1) {
            return new Response(JSON.stringify({error: "No links found for " + media.title}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            ytsLinks = await ytsGetMagnetLink(ytsRes[0].pageUrl);
        }

        let res = {};

        if (ytsLinks && ytsLinks.length > 0) res.yts = ytsLinks;

        return new Response(JSON.stringify({res: res}), {
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
