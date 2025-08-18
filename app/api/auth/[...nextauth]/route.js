// app/api/auth/[...nextauth]/route.js
export const runtime = "nodejs";

import { handlers } from "../../../../auth"; // root-level auth.js (Node-only)

export const { GET, POST } = handlers;
