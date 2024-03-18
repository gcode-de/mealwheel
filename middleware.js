import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Ignoriere die Middleware für die Anmelde- und API-Routen
  if (pathname.includes("/api/auth") || pathname.includes("/api")) {
    return NextResponse.next();
  }

  // Wenn kein Token vorhanden ist, leite zum Login um, außer es ist die Login-Seite
  if (!token && pathname === "/profile") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
