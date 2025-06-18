import {getConnectedUser} from "@/app/utils/apiUtil";
import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {User} from "@/app/models/user";

export async function GET() {
    const user = await getConnectedUser();
    if (!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
        SELECT u.*
        FROM users u, subscriptions s
        WHERE s.subscribed_id = ${user.id} and s.user_id = u.id
    `;
    return NextResponse.json((response as User[]), {status: 200});
}