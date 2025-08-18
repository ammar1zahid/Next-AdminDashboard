// auth.js (root level)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials", 
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log("[auth] authorize called with no credentials");
          return null;
        }

        try {
          // Dynamic imports for Edge runtime compatibility
          const { default: connect } = await import("./app/lib/utils");
          const models = await import("./app/lib/models");
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
            return null;
          }

          // Check if user is admin
          if (user.isAdmin === false) {
            console.log("[auth] user isAdmin false, blocking login for:", credentials.username);
            return null; // Uncomment to enforce admin-only access
          }

          if (!user.password) {
            console.log("[auth] user has no password stored for:", credentials.username);
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.log("[auth] wrong password for:", credentials.username);
            return null;
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
          return null;
        }
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

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);