import authenticateToken from "@/app/api/authenticateToken";

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { link, token } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const res = await fetch(link);
        if (res.status === 500) {
            return new Response(JSON.stringify({message: 'server error'}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            });
        } else if (res.status === 404) {
            return new Response(JSON.stringify({message: 'link not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const data = await res.text()

        return new Response(JSON.stringify({ res: data }), {
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

