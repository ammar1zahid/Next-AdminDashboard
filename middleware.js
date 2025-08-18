import { auth } from "@/app/api/auth/[...nextauth]/route"; // ✅ Edge-safe

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Prevent logged-in users from visiting /login
  if (pathname === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  return null; // allow request
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
