
import authenticateToken from "@/app/api/authenticateToken";
import tmdbSearchMovie from "@/app/api/media/tmdb/tmdbSearchMovie";
import tmdbSearchTv from "@/app/api/media/tmdb/tmdbSearchTv";
export const dynamic = 'force-dynamic';

/**
 * Search for movies and tv shows
 * @param req
 * @param params
 * @returns {Promise<Response>}
 * @constructor
 */
export async function GET(req, { params }) {
    try {
        const {searchValue} = params;
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

        // Search for movies and tv shows with tmdb api
        const movieSearchResult = await tmdbSearchMovie(searchValue);
        const tvSearchResult = await tmdbSearchTv(searchValue);
        const searchResult = movieSearchResult.concat(tvSearchResult);

        return new Response(JSON.stringify({ res: searchResult }), {
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