// /auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "./app/lib/utils";        // adjust if you move this file
import { User } from "./app/lib/models";     // adjust path if needed
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await connect();
        const user = await User.findOne({ username: credentials.username });
        if (!user || !user.isAdmin) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          img: user.img || null,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.img = user.img;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user ?? {};
        session.user.username = token.username;
        session.user.img = token.img;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST }, // route handlers for app/api route re-export
  auth,                     // function used in server components or middleware
  signIn,
  signOut,
} = NextAuth(authOptions);
