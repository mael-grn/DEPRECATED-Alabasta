import jwt from "jsonwebtoken";

/**
 * Authenticate the token
 * Will return the user id if the token is valid, otherwise will return null
 * @param token
 * @returns {Promise<*>}
 */
export default async function authenticateToken(token) {
    const secretKey = process.env.AUTH_SECRET
    try {
        const res = jwt.verify(token, secretKey)
        return res.key;
    } catch (e) {
        return null;
    }
}

