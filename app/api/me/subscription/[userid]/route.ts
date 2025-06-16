import {cookies} from "next/headers";
import {getIdFromToken} from "@/app/utils/tokenUtil";
import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";

/**
 * Savoir si on est abonné à cet utilisateur
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    // On récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const subscribedId = await getIdFromToken(token!.value);

    const { userid } = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
            SELECT *
            FROM subscriptions
            WHERE user_id= ${userid} and subscribed_id=${subscribedId}
        `;

    if (response.length === 0) {
        return NextResponse.json(("Not subscribed"), {status: 404});
    } else {
        return NextResponse.json(("Subscribed"), {status: 200});
    }
}