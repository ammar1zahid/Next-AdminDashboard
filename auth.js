// auth.js (Node-only)
"use server";

import NextAuth from "next-auth";
import { baseAuthConfig } from "./auth.config";
import { nodeProviders } from "./auth.node";

export const authConfig = {
  ...baseAuthConfig,
  providers: nodeProviders,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
