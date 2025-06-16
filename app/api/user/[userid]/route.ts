import {neon} from "@neondatabase/serverless";
import {InsertableUser, User} from "@/app/models/user";
import {NextResponse} from "next/server";
import {hashPassword} from "@/app/utils/passwordUtil";
import {isUserAdmin} from "@/app/utils/apiUtil";

/**
 * Récupération des informations d'un utilisateur par son identifiant.
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {

    const { userid } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const isAdmin = await isUserAdmin();
    if (!isAdmin) return NextResponse.json(("You don't have enough privileges for this action"), {status: 403});

    // Selection de l'utilisateur par son identifiant
    const response = await sql`
            SELECT *
            FROM users
            WHERE id= ${userid}
        `;

    // Si l'utilisateur n'existe pas, renvoie une erreur 404
    if (response.length === 0) {
        return NextResponse.json(("User not found"), {status: 404});
    }

    const user: User = response[0] as User;
    return NextResponse.json((user), {status: 200});
}

export async function PUT(request: Request, { params }: { params: Promise<{ userid: string }> }) {
    const { userid } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const isAdmin = await isUserAdmin();
    if (!isAdmin) return NextResponse.json(("You don't have enough privileges for this action"), {status: 403});

    // Mise à jour de l'utilisateur
    const newUser : InsertableUser = await request.json();
    const hashedPassword = hashPassword(newUser.password);
    await sql`
        UPDATE users
        SET username    = ${newUser.username},
            first_name  = ${newUser.first_name},
            last_name   = ${newUser.last_name},
            is_admin    = ${newUser.is_admin},
            is_approved = ${newUser.is_approved},
            is_public   = ${newUser.is_public},
            password    = ${hashedPassword}
        WHERE id = ${userid}
    `;

    return NextResponse.json(("User updated successfully"), {status: 200});
}

export async function DELETE(request: Request, { params }: { params: Promise<{ userid: string }> }) {
    const { userid } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const isAdmin = await isUserAdmin();
    if (!isAdmin) return NextResponse.json(("You don't have enough privileges for this action"), {status: 403});

    // Suppression de l'utilisateur
    await sql`
        DELETE FROM users
        WHERE id = ${userid}
    `;

    return NextResponse.json(("User deleted successfully"), {status: 200});
}