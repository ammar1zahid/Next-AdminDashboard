// app/api/auth/[...nextauth]/route.js
export const runtime = "nodejs";

import NextAuth from "next-auth";
// baseAuthConfig comes from auth-config.js (root)
import { baseAuthConfig } from "../../../../auth.config";
// nodeProviders comes from auth-node.js (root) which defines the Credentials provider using DB
import { nodeProviders } from "../../../../auth.node";

// combine them so NextAuth receives providers + callbacks + secret
const nextAuthConfig = {
  ...baseAuthConfig,
  providers: nodeProviders,
  // ensure session strategy is set (optional but explicit)
  session: { strategy: "jwt" },
};

export const { GET, POST } = NextAuth(nextAuthConfig);
