import {deleteOSToken, getOSToken} from "@/app/api/subs/openSubtitle/OSToken";

/**
 * Download subtitles from opensubtitle. Subs are converted to webvtt format
 * @param subsId {string} - subtitle id
 * @returns {Promise<string|null>}
 */
export default async function openSubtitleDownload(subsId) {

    //recover the token for the opensubtitle api
    const osToken = await getOSToken();
    if (!osToken) {
        console.error("impossible to get open subtitle token")
        return null;
    }

    const linkResponse = await fetch('https://api.opensubtitles.com/api/v1/download', {
        method: 'POST',
        headers: {
            'Api-Key': `${process.env.OPEN_SUBS_API_KEY}`,
            'Authorization': `Bearer ${osToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file_id: subsId
        })
    });

    if (!linkResponse.ok) {
        await deleteOSToken();
        console.error("unable to get subtitle download link : " + linkResponse.status)
        return null;
    }

    //get the link to download the subtitles
    const linkData = await linkResponse.json();

    const subsResponse = await fetch(linkData.link, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!subsResponse.ok) {
        await deleteOSToken();
        console.error("unable to download subtitles : " + subsResponse.status)
        return null;
    }

    //convert the subtitles to webvtt format
    const subsData = await subsResponse.text();
    return srt2webvtt(subsData);
}

/**
 * Convert srt subtitles to webvtt format
 * Copied from another person on the internet, don't ask me how it works
 * @param data
 * @returns {string}
 */
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

/**
 * Convert individual srt subtitle to webvtt format
 * Copied from another person on the internet, don't ask me how it works
 * @param caption
 * @returns {string}
 */
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