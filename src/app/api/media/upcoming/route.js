
import authenticateToken from "@/app/api/authenticateToken";
import tmdbGetPopular from "@/app/api/media/tmdb/tmdbGetPopular";
import tmdbGetUpcoming from "@/app/api/media/tmdb/tmdbGetUpcoming";

export async function GET(req, res) {
    try {
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

        const upComing = await tmdbGetUpcoming();

        return new Response(JSON.stringify({ res: upComing }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}