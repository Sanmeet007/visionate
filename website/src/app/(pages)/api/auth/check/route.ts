export const dynamic = 'force-dynamic';

/**
 *
 * ROUTE: /api/auth/check
 * ALLOWED METHODS: GET
 *
 * --------------------
 * GET : ( None )
 * API route to check if user is logged in or not
 *    - If logged in, returns with success
 *    - Else logs 401 Error
 * --------------------
 */

import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { NextResponse } from "next/server";

export const GET = usingAuthMiddleware(() => {
  return NextResponse.json({
    error: false,
    message: "User is valid !",
  });
});
