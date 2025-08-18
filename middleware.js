// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware that checks session token using next-auth/jwt (Edge-compatible).
 * Note: Do NOT import any server/db modules here.
 */

export async function middleware(req) {
  // getToken is Edge-compatible and reads the NextAuth cookie
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/login",
  ],
};
