// app/api/auth/[...nextauth]/route.js
export const runtime = "nodejs";

import { handlers } from "../../../../auth";

export const { GET, POST } = handlers;