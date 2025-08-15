// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Important:
 * - dynamic imports for node-only libs are inside authorize (so middleware can import this file in Edge).
 * - basePath set explicitly to where the auth API is mounted. Default is "/api/auth".
 */

const DEFAULT_BASEPATH = "/api/auth"; // change only if you use next.config.js basePath

export const authOptions = {
  basePath: process.env.NEXTAUTH_BASEPATH || DEFAULT_BASEPATH,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },

async authorize(credentials) {
  if (!credentials) {
    console.log("[auth] authorize called with no credentials");
    return null;
  }

  try {
    // dynamic imports (same relative paths as before)
    const { default: connect } = await import("../../../lib/utils");
    const models = await import("../../../lib/models");
    // switch to bcryptjs if bcrypt native gives trouble: import("bcryptjs")
    const { default: bcrypt } = await import("bcrypt");

    await connect();

    const { User } = models;
    if (!User) {
      console.error("[auth] User model missing");
      return null;
    }

    console.log("[auth] trying login for username:", credentials.username);

    const user = await User.findOne({ username: credentials.username }).lean();
    if (!user) {
      console.log("[auth] user not found for:", credentials.username);
      return null; // invalid username
    }

    // Optional: disable isAdmin check while testing
    if (user.isAdmin === false) {
      console.log("[auth] user isAdmin false, blocking login for:", credentials.username);
      // return null; // uncomment to enforce
    }

    if (!user.password) {
      console.log("[auth] user has no password stored (username):", credentials.username);
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) {
      console.log("[auth] wrong password for:", credentials.username);
      return null; // wrong password
    }

    console.log("[auth] login success for:", credentials.username);

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      img: user.img || null,
      isAdmin: user.isAdmin,
    };
  } catch (err) {
    console.error("[auth] authorize error:", err);
    // Return null to avoid leaking internal error details to client.
    return null;
  }
}

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
      session.user = session.user ?? {};
      if (token) {
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
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
