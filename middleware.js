// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log("🛡️ [Middleware] Request for:", pathname);
  console.log("🌐 [Middleware] Full URL:", req.url);

  // --- QUICK SAFETY: do not run middleware on API routes, Next internals, static files or assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // file extension -> static asset
  ) {
    console.log("⏩ [Middleware] Skipping middleware for:", pathname);
    return NextResponse.next();
  }

  // getToken reads the JWT created by NextAuth (works in middleware)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("🎟️ [Middleware] Token:", token ? "EXISTS" : "NULL");
  console.log("👤 [Middleware] Token details:", {
    username: token?.username,
    isAdmin: token?.isAdmin,
    email: token?.email
  });

  const isLoggedIn = !!token;
  const isAdmin = !!token?.isAdmin;

  console.log("✅ [Middleware] isLoggedIn:", isLoggedIn);
  console.log("👑 [Middleware] isAdmin:", isAdmin);

  // Redirect root "/" → login or dashboard depending on auth
  if (pathname === "/") {
    const redirectTo = isLoggedIn ? "/dashboard" : "/login";
    console.log("🏠 [Middleware] Root redirect to:", redirectTo);
    return NextResponse.redirect(
      new URL(redirectTo, req.url)
    );
  }

  // Protect dashboard routes (require login AND admin)
  if (pathname.startsWith("/dashboard")) {
    console.log("📊 [Middleware] Dashboard route access check");
    
    if (!isLoggedIn) {
      console.log("🚫 [Middleware] Not logged in, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Optional: enforce admin-only access (restore old behaviour)
    if (!isAdmin) {
      console.log("🚫 [Middleware] Not admin, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    console.log("✅ [Middleware] Dashboard access granted");
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && isLoggedIn) {
    console.log("🔄 [Middleware] Logged in user on login page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  console.log("✅ [Middleware] Allowing request to proceed");
  return NextResponse.next();
}

/*
  Run middleware for all non-api/_next/static routes.
  This matcher ensures middleware won't run for /api/auth/* and static assets.
*/
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
