
import jwt from 'jsonwebtoken';
import ytsSearch from "@/app/api/media/yts/search";
import authenticateToken from "@/app/api/authenticateToken";
import {deleteOSToken, getOSToken} from "@/app/api/media/subs/OSToken";

export async function POST(req, res) {
    try {
        if (!req.body) {
            return new Response(JSON.stringify({ message: 'wrong data in the query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { subsId, token } = await req.json();

        const userId = authenticateToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'wrong token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const osToken = await getOSToken();
        if (!osToken) {
            return new Response(JSON.stringify({ message: 'server error : unable to connect to open subtitle' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(subsId);
        console.log(osToken);

        const linkResponse = await fetch('https://api.opensubtitles.com/api/v1/download', {
            method: 'POST',
            headers: {
                'Api-Key': "W9xgGQq7r2d7gB9jt8HxnK7xBMt7hpIY",
                'Authorization': `Bearer ${osToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_id: subsId
            })
        });

        if (!linkResponse.ok) {
            await deleteOSToken();
            return new Response(JSON.stringify({ message: 'server error', error: linkResponse.status }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const linkData = await linkResponse.json();

        const subsResponse = await fetch(linkData.link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!subsResponse.ok) {
            await deleteOSToken();
            return new Response(JSON.stringify({ message: 'server error', error: subsResponse.status }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const subsData = await subsResponse.text();
        const convertedSubs = srt2webvtt(subsData);

        return new Response(JSON.stringify({ subs: convertedSubs }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        await deleteOSToken();
        return new Response(JSON.stringify({message: 'server error : ' + error}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}

function srt2webvtt(data) {
    // remove dos newlines
    var srt = data.replace(/\r+/g, '');
    // trim white space start and end
    srt = srt.replace(/^\s+|\s+$/g, '');
    // get cues
    var cuelist = srt.split('\n\n');
    var result = "";
    if (cuelist.length > 0) {
        result += "WEBVTT\n\n";
        for (var i = 0; i < cuelist.length; i=i+1) {
            result += convertSrtCue(cuelist[i]);
        }
    }
    return result;
}
function convertSrtCue(caption) {
    // remove all html tags for security reasons
    //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
    var cue = "";
    var s = caption.split(/\n/);
    // concatenate muilt-line string separated in array into one
    while (s.length > 3) {
        for (var i = 3; i < s.length; i++) {
            s[2] += "\n" + s[i]
        }
        s.splice(3, s.length - 3);
    }
    var line = 0;
    // detect identifier
    if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
        cue += s[0].match(/\w+/) + "\n";
        line += 1;
    }
    // get time strings
    if (s[line].match(/\d+:\d+:\d+/)) {
        // convert time string
        var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
        if (m) {
            cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
                +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
            line += 1;
        } else {
            // Unrecognized timestring
            return "";
        }
    } else {
        // file format error or comment lines
        return "";
    }
    // get cue text
    if (s[line]) {
        cue += s[line] + "\n\n";
    }
    return cue;
}