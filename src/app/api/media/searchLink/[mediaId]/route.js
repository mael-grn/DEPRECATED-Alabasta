import authenticateToken from "@/app/api/authenticateToken";
import tasfSearchLinkMovie from "@/app/api/media/tasf/tasfSearchLinkMovie";
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

        const res = await tasfSearchLinkMovie(mediaId);

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
