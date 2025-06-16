import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";
import {Opinion} from "@/app/models/opinion";
import {getMediaDetails} from "@/app/utils/tmdbUtil";

/**
 * Récuperer tous les opinions d'un utilisateur
 * @params request
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    const sql = neon(`${process.env.DATABASE_URL}`);
    const {userid} = await params;

    // Récupération des opinions de l'utilisateur
    const response = await sql`
        SELECT o.*, u.id as user_id, u.username, u.first_name, u.last_name, u.is_public, u.is_approved, u.is_admin, u.created_at as user_created_at
        FROM opinions as o, users as u
        WHERE user_id = ${userid}
    `;

    const opinions : Opinion[] = await Promise.all(
        response.map(async (row) => {
            const media = await getMediaDetails(row.tmdb_id);
            return {
                id: row.id,
                media: media!,
                grade: row.grade,
                comment: row.comment,
                created_at: new Date(Date.parse(row.created_at)),
                user: {
                    id: row.user_id,
                    username: row.username,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    is_public: row.is_public,
                    is_approved: row.is_approved,
                    is_admin: row.is_admin,
                    created_at: new Date(Date.parse(row.user_created_at))
                }
            }
        })
    );

    return NextResponse.json((opinions), {status: 200});
}