import {InsertableUser, User} from "@/app/models/user";
import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";
import {hashPassword} from "@/app/utils/passwordUtil";
import {isUserAdmin} from "@/app/utils/apiUtil";

export const dynamic = 'force-static'

/**
 * Création d'un compte utilisateur
 * Verifie si le nom d'utilisateur existe déjà, si oui, renvoie une erreur 409.
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    const insertableUser: InsertableUser = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Vérification de l'existence du nom d'utilisateur
    const userWithUsername = await sql`SELECT * FROM USERS WHERE username = ${insertableUser.username.toLowerCase()} LIMIT 1`;
    if (userWithUsername.length > 0) {
        return NextResponse.json(("Username already exists"), {status: 409});
    }

    const hashedPassword = await hashPassword(insertableUser.password);

    // Création de l'utilisateur
    await sql`INSERT INTO users (username, first_name, last_name, is_public, password)
                  VALUES (${insertableUser.username}, ${insertableUser.first_name}, ${insertableUser.last_name},
                          ${insertableUser.is_public}, ${hashedPassword})`;

    return NextResponse.json(("User created"), {status: 200});
}

/**
 * Recherche d'utilisateurs par nom d'utilisateur, prénom ou nom de famille.
 * Prends en compte un paramètre URL 'q' contenant la query de la recherche d'utilisateurs
 * @param request
 * @constructor
 */
export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('q');

    const isAdmin = await isUserAdmin();
    if (!query && !isAdmin) return NextResponse.json(({error: "The parameter 'q' is necessary for non admin users"}), {status: 402});

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Recherche d'utilisateurs dont le nom d'utilisateur, prénom ou nom de famille contient la query
    let response;

    // Si l'utilisateur est admin et qu'il y a pas de query, on retourne tous les utilisateurs
    if (isAdmin && !query) {
        const specifiedPage = parseInt(searchParams.get('p') || '1');
        const limit = 10;
        const offset = (specifiedPage - 1) * limit;
        response = await sql`
            SELECT *
            FROM users
            LIMIT ${limit}
                OFFSET ${offset}
        `;
    } else {
        response = await sql`
            SELECT *
            FROM users
            WHERE (username ILIKE ${`%${query}%`} OR first_name ILIKE ${`%${query}%`} OR last_name ILIKE ${`%${query}%`})
              AND is_public = TRUE
            LIMIT 10
        `;
    }

    // Conversion de la réponse en tableau d'utilisateurs
    const users: User[] = response as User[];

    return NextResponse.json((users), {status: 200});
}

