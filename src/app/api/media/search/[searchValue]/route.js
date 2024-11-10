
import authenticateToken from "@/app/api/authenticateToken";
import tmdbSearch from "@/app/api/media/tmdb/tmdbSearch";

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

        const searchResult = await tmdbSearch(searchValue);

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