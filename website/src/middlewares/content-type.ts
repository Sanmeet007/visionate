import { usersTable } from "@/drizzle/schema";
import { headers as requestHeaders } from "next/headers";
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
 *  - Checks the request header to ensure it contains a valid content type
 *  - The second parameter in the callback function can be either null or a valid user object,
 *  depending on the authentication middleware used before this one
 *
 * @example
 *  usingContentTypeMiddleware((request)=>{
 *    return new NextResponse()
 *  } , "application/json")
 */
export const usingContentTypeMiddleware = (
  callback: MiddlewareCallback,
  contentType: "application/json" | "text/plain" | string
) => {
  return cache(
    async (
      request: NextRequest,
      user: typeof usersTable.$inferSelect | null | undefined = null
    ) => {
      try {
        const headers = await requestHeaders();
        if (headers.get("Content-Type") !== contentType) {
          return NextResponse.json(
            {
              error: true,
              message: "Invalid content type",
            },
            {
              status: 400,
            }
          );
        }
        return await callback(request, user);
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
