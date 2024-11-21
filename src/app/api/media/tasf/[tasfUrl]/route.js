export const dynamic = 'force-dynamic';

export async function GET(req, {params}) {
    try {
        const {tasfUrl} = params;

        const targetUrl = `http://theyallsayflix.su:8081/download/${tasfUrl}`;

        const headers = new Headers();
        if (req.headers.get('range')) {
            headers.set('range', req.headers.get('range'));
        }

        const response = await fetch(targetUrl, {
            headers,
        });

        const body = response.body;

        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', response.headers.get('Content-Type'));
        responseHeaders.set('Content-Length', response.headers.get('Content-Length'));

        // Inclure aussi l'en-tête `Content-Range` pour le streaming
        if (response.headers.get('Content-Range')) {
            responseHeaders.set('Content-Range', response.headers.get('Content-Range'));
        }

        return new Response(body, {
            status: response.status,
            headers: responseHeaders,
        });


    } catch (error) {
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}