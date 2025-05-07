import {neon} from "@neondatabase/serverless";
import {hashPassword} from "@/app/utils/passwordUtil";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { username, firstName, lastName, password } = await req.json()

    //récuperation de l'utilisateur
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql`SELECT * FROM USERS WHERE username = ${username} LIMIT 1`;
    if (res.length > 0) return NextResponse.json({}, {status: 409});

    const hashedPassword = await hashPassword(password);
    await sql`INSERT INTO USERS (username, first_name, last_name, password) VALUES (${username}, ${firstName}, ${lastName}, ${hashedPassword})`;

    return NextResponse.json({ status: 200 })
}