import {cookies} from "next/headers";
import {verifyJwt} from "@/app/utils/tokenUtil";
import {NextResponse} from "next/server";
import User from "@/app/models/user";


export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    console.log(token)
    if (!token) return NextResponse.json({ error: 'Token manquant' },{status: 401});
    const res = verifyJwt<User>(token.value);
    if (!res) return NextResponse.json({ error: 'JWT invalide' }, {status: 401});
    else return NextResponse.json({ user: res }, { status: 200 })
}