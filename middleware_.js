// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   if (pathname.includes("/api/auth") || pathname.includes("/api")) {
//     return NextResponse.next();
//   }

//   if (!token && pathname === "/profile") {
//     const url = req.nextUrl.clone();
//     url.pathname = "/api/auth/signin";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

export { default } from "next-auth/middleware";

export const config = { matcher: ["/profile/:path*"] };
