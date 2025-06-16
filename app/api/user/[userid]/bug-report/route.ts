import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";
import {isUserAdmin} from "@/app/utils/apiUtil";
import {BugReport} from "@/app/models/bugReport";

/**
 * Récuperer tous les opinions d'un utilisateur
 * @params request
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    const isAdmin = await isUserAdmin();
    if (!isAdmin) return NextResponse.json(("You don't have enough privileges for this action"), {status: 403});

    const sql = neon(`${process.env.DATABASE_URL}`);
    const {userid} = await params;

    // Récupération des opinions de l'utilisateur
    const response = await sql`
    SELECT 
        br.id as bug_id, br.details, br.created_at, br.category,
        u.id as user_id, u.username, u.first_name, u.last_name, u.is_public, u.is_approved, u.is_admin, u.created_at as user_created_at
    FROM bug_reports br
    JOIN users u ON br.user_id = u.id
    WHERE br.user_id = ${userid}`;

    const bugReports : BugReport[] = response.map((row) => ({
        id: row.bug_id,
        details: row.details,
        created_at: new Date(Date.parse(row.created_at)),
        category: row.category,
        user: {
            id: row.user_id,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name,
            is_public: row.is_public,
            is_approved: row.is_approved,
            is_admin: row.is_admin,
            created_at: new Date(Date.parse(row.user_created_at)),
        }
    }));

    return NextResponse.json((bugReports), {status: 200});
}