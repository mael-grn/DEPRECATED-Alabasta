
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetDetailsSeason from "@/app/api/media/tmdb/tmdbGetDetailsSeason";
export const dynamic = 'force-dynamic';

/**
 * get tv season details from tmdb API
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
        const { tvId, season, token } = await req.json();
        const userId = await authenticateToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // get tv season details
        const detailedSeason = await tmdbGetDetailsSeason(tvId, season);

        return new Response(JSON.stringify({ res: detailedSeason }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}