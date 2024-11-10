import {sql} from "@vercel/postgres";

/**
 * Initialize the stream for the given torrent url with the website yts
 * It consists in adding the stream url to the database
 * @param torrentUrl the torrent url to be streamed
 * @param userId the user id needed for the insert
 */
export default async function ytsInitStream(torrentUrl, userId) {
    const streamId = userId + Date.now().toString();
    await sql`
            INSERT into streaming_url(streamid, torrenturl, userid) VALUES (${streamId}, ${torrentUrl}, ${userId});
            `;
    return streamId;
}