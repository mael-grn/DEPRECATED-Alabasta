import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";

export async function middleware(request: NextRequest) {
    const cookieHandler = await cookies();
    if (!cookieHandler.get('token')) return NextResponse.redirect(new URL('/register', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/secure/:path*',
}