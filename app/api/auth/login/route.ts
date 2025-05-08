import {neon} from "@neondatabase/serverless";
import {checkPassword} from "@/app/utils/passwordUtil";
import {createJwt} from "@/app/utils/tokenUtil";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { username, password } = await req.json()

    //récuperation de l'utilisateur
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql`SELECT * FROM USERS WHERE username = ${username.toLowerCase()} LIMIT 1`;
    if (res.length < 1) return NextResponse.json({}, {status: 404});

    //verification du mot de passe
    const passwordVerificationRes = await checkPassword(password, res[0].password);
    if (!passwordVerificationRes) return NextResponse.json({}, {status: 401});

    if (!res[0].is_approved) return NextResponse.json({}, {status: 403});
    //création du jwt
    const jwt = createJwt(res[0]);

    const response = NextResponse.json({ user: res[0] }, { status: 200 })

    // Définir un cookie sécurisé
    response.cookies.set('token', jwt, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    })

    return response
}