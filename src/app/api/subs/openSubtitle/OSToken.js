import {sql} from "@vercel/postgres";

/**
 * Get OpenSubtitles token from database or fetch a new one
 * @returns {Promise<*|null>}
 */
export const getOSToken = async () => {
    const { rows } = await sql`
                SELECT * FROM opensubs_token;
            `;

    if (rows.length !== 0) {
        return rows[0].token;
    } else {
        const res = await fetch('https://api.opensubtitles.com/api/v1/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Api-Key': 'W9xgGQq7r2d7gB9jt8HxnK7xBMt7hpIY',
                'Content-Type': 'application/json',
                'User-Agent': 'Alabasta v0.1'
            },
            body: JSON.stringify({
                "username": 'Nivea5',
                "password": 'alabasta12345'
            })
        })


        if (res.status !== 200) {
            return null
        } else {

            const data = await res.json();
            await sql`
                    INSERT INTO opensubs_token (token) VALUES (${data.token});
                `;
            return data.token;
        }
    }
}

/**
 * Delete OpenSubtitles token from database
 * @returns {Promise<void>}
 */
export const deleteOSToken = async () => {
    await sql`
                    DELETE FROM opensubs_token;
                `;
}