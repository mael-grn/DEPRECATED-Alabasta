import peerflix from 'peerflix';
import {sql} from "@vercel/postgres";
import authenticateToken from "@/app/api/authenticateToken";
import getMagnetLink from "@/app/api/media/yts/getMagnetLink";
import ytsSearch from "@/app/api/media/yts/search";

export async function POST(req, res ) {
    try {

        const { token, media } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const targetUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${media.title.replace(/ /g, '+')}&y=${media.year}`;

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();

        media.title = json.Title;
        media.poster = json.Poster === "N/A" ? media.poster : json.Poster;
        media.year = json.Year;
        media.runtime = json.Runtime;
        media.genre = json.Genre;
        media.director = json.Director;
        media.writer = json.Writer;
        media.actors = json.Actors.split(", ");
        media.plot = json.Plot;
        media.awards = json.Awards;
        media.country = json.Country;
        media.ratings = json.Ratings;
        media.type = json.Type;
        media.imdbID = json.imdbID;
        media.imdbRating = json.imdbRating;
        media.imdbVotes = json.imdbVotes

        if (media.provider === "yts") {
            media.qualitiesLinks = await getMagnetLink(media.pageUrl);
        } else if (!media.provider || media.provider === "") {
            const ytsSearchResult = await ytsSearch((media.title + " " + media.year));
            if (ytsSearchResult.length > 0) {
                media.provider = "yts";
                media.pageUrl = ytsSearchResult[0].url;
                media.qualitiesLinks = await getMagnetLink(media.pageUrl);
            }
        }

        return new Response(JSON.stringify({media: media}), {
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
