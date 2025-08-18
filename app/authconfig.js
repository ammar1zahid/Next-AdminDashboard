// app/authconfig.js
// This file can be used for auth configuration that doesn't require imports
// that might not work in Edge runtime (like database connections)

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      
      // If user is trying to access dashboard without being logged in
      if (pathname.startsWith("/dashboard") && !isLoggedIn) {
        return false; // This will redirect to login page
      }
      
      // If user is logged in and trying to access login page, redirect to dashboard
      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // Add providers here if needed for middleware
};