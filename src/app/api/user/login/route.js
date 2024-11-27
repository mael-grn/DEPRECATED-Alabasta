import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Route to log a user in
 * @param req
 * @param res
 * @returns {Promise<Response|*>}
 * @constructor
 */
export async function POST(req, res) {
        try {
            //await addUser();
            // extraction des données de la requête
            if (!req.body) {
                return res.status(400).json({ message: "wrong cookies with the query. expected email and password" });
            }
            const { key } = await req.json();

            if (!key) {
                return new Response(JSON.stringify({ message: 'no key parameter found' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Requête SQL pour vérifier les identifiants
            const { rows } = await sql`
                SELECT * FROM users;
            `;

            // Vérification de l'existence de l'utilisateur
            if (rows.length === 0) {
                return new Response(JSON.stringify({ message: 'user not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                let userFound = false;
                let i = 0;
                let user;
                while (!userFound && i < rows.length) {
                    user = rows[i];
                    try {
                        userFound = await bcrypt.compare(key, user.pswd);
                    } catch (e) {
                    }

                    i++;
                }

                if (!userFound) {
                    return new Response(JSON.stringify({ message: 'user credentials are incorrect' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }

                const secretKey = process.env.AUTH_SECRET;
                const token = jwt.sign({ key: user.id }, secretKey, { expiresIn: '10d' });
                return new Response(JSON.stringify({ message: 'user credentials are correct', res: {user: user, token: token }}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

        } catch (error) {
            return new Response(JSON.stringify({ message: `server error: ${error}`}), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
}

async function addUser() {

    const hashedKey = await bcrypt.hash('2104', 10);
    await sql`
            INSERT INTO USERS (pswd, name, surname) VALUES (${hashedKey}, 'Mike', 'Lebeau');
        `;
}
