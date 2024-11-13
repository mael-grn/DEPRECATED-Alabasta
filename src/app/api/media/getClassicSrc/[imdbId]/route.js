
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const {imdbId} = params;
        const token = req.headers.get('Authorization');

        /*
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

         */

        const url = "https://vidsrc.xyz/embed/movie/" + imdbId
        const response = await fetch(url);
        const html = await response.text();


        if (!html) {
            return new Response(JSON.stringify({message: 'video not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({res: html}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });

    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}