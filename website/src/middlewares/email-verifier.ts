import { usersTable } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

interface MiddlewareCallback {
  (
    request: NextRequest,
    user: typeof usersTable.$inferSelect | null | undefined
  ): Promise<NextResponse> | NextResponse;
}

/**
 * Middleware function
 * - Verifies whether the logged-in user's email is confirmed.
 *
 * @example
 *  usingEmailVerificationMiddleware((request)=>{
 *    return new NextResponse()
 *  })
 */
export const usingEmailVerificationMiddleware = (
  callback: MiddlewareCallback
) => {
  return cache(
    async (
      request: NextRequest,
      user: typeof usersTable.$inferSelect | null | undefined = null
    ) => {
      try {
        if (user?.emailVerified) {
          return await callback(request, user);
        }

        return NextResponse.json(
          {
            error: true,
            message:
              "Email verification required. Please verify your email to proceed.",
          },
          {
            status: 403,
          }
        );
      } catch (e) {
        if (Number(process.env.LOGGING_LEVEL) > 0) {
          console.error(e);
        }
        return NextResponse.json(
          {
            error: true,
            message: "Something went wrong",
          },
          {
            status: 500,
          }
        );
      }
    }
  );
};
