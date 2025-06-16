import {cookies} from "next/headers";
import {getIdFromToken} from "@/app/utils/tokenUtil";
import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";

/**
 * Récuperer les abonnements d'un utilisateur
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    const { userid } = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
            SELECT users.*
            FROM users, subscriptions
            WHERE subscribed_id=${userid}
                AND users.id = subscriptions.user_id
        `;

    if (response.length === 0) {
        return NextResponse.json(("Not subscribed"), {status: 404});
    } else {
        return NextResponse.json((response), {status: 200});
    }
}

/**
 * Ajout d'un abonnement à un utilisateur
 * @param request
 * @param params
 * @constructor
 */
export async function POST(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    // On récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const subscribedId = await getIdFromToken(token!.value);

    const { userid } = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    // On vérifie si l'utilisateur est déjà abonné
    const response = await sql`
            SELECT *
            FROM subscriptions
            WHERE user_id= ${userid} and subscribed_id=${subscribedId}
        `;

    if (response.length > 0) {
        return NextResponse.json(("Already subscribed"), {status: 400});
    }

    // On ajoute l'abonnement
    await sql`
        INSERT INTO subscriptions (user_id, subscribed_id)
        VALUES (${userid}, ${subscribedId})
    `;

    return NextResponse.json(("Subscribed successfully"), {status: 200});
}

/**
 * Suppression d'un abonnement à un utilisateur
 * @param request
 * @param params
 * @constructor
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    // On récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const subscribedId = await getIdFromToken(token!.value);

    const {userid} = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    // On vérifie si l'utilisateur est abonné
    const response = await sql`
        SELECT *
        FROM subscriptions
        WHERE user_id = ${userid}
          and subscribed_id = ${subscribedId}
    `;

    if (response.length === 0) {
        return NextResponse.json(("Not subscribed"), {status: 404});
    }

    // On supprime l'abonnement
    await sql`
        DELETE
        FROM subscriptions
        WHERE user_id = ${userid}
          and subscribed_id = ${subscribedId}
    `;

    return NextResponse.json(("Unsubscribed successfully"), {status: 200});
}