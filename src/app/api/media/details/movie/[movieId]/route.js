
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetNowPlaying from "@/app/api/media/tmdb/tmdbGetNowPlaying";
import tmdbGetDetailsMovie from "@/app/api/media/tmdb/tmdbGetDetailsMovie";
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const token = req.headers.get('Authorization');
        const {movieId} = params;

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

        const detailedMovie = await tmdbGetDetailsMovie(movieId);

        return new Response(JSON.stringify({ res: detailedMovie }), {
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