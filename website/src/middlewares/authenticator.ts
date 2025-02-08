import { lucia } from "@/auth";
import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { cookies as requestCookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

interface MiddlewareCallback {
  (request: NextRequest, user: typeof usersTable.$inferSelect):
    | Promise<NextResponse>
    | NextResponse;
}

interface MiddlewareCallbackWithNullUser {
  (
    request: NextRequest,
    user: typeof usersTable.$inferSelect | null | undefined
  ): Promise<NextResponse> | NextResponse;
}

interface MiddlewareParams {
  allowedRoles: "admin" | "moderator" | "customer" | "any";
}

/**
 * Middleware function to handle API request authentication
 *   - Intercepts incoming requests and checks if the user is logged in
 *   - If the user is logged in, it allows the request to proceed to the callback function
 *   - If the user is not logged in, it responds with a 401 Unauthorized status
 *
 * @example
 *  usingAuthMiddleware((request , user ) => {
 *    console.log(user)
 *    return new NextResponse();
 *  } , { allowedRoles : [...validUserRoles] })
 */

export const usingAuthMiddleware = (
  callback: MiddlewareCallback,
  params?: MiddlewareParams
) => {
  return cache(async (request: NextRequest) => {
    try {
      const cookies = await requestCookies();
      const cookie = cookies.get(lucia.sessionCookieName);
      if (cookie?.value) {
        const { user, session } = await lucia.validateSession(cookie.value);
        const userData = await db.query.usersTable.findFirst({
          where: sql`id = ${user?.id}`,
        });

        if (session && session.fresh) {
          const sessionCookie = lucia.createSessionCookie(session.id);
          cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );
        }

        if (!session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );
          return NextResponse.json(
            {
              error: true,
              message: "Invalid session",
            },
            {
              status: 401,
            }
          );
        }
        if (!userData)
          return NextResponse.json(
            {
              error: true,
              message: "Invalid user",
            },
            {
              status: 400,
            }
          );

        if (params) {
          if (!params.allowedRoles.includes(userData.role)) {
            return NextResponse.json(
              {
                error: true,
                message: "Forbidden",
              },
              {
                status: 403,
              }
            );
          }
        }
        return await callback(request, userData);
      } else {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
        return NextResponse.json(
          {
            error: true,
            message: "Invalid session",
          },
          {
            status: 401,
          }
        );
      }
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
  });
};

/**
 *  Middleware function to handle API request authentication
 *   - Intercepts incoming requests and checks if the user is logged in
 *   - If the user is logged in, it proceeds to the callback function with the second argument as the user object
 *   - If the user is not logged in, it proceeds to the callback function with the second argument as null
 *
 * @example
 *  usingLoginMiddleware((request , user ) => {
 *    console.log(user)
 *    return new NextResponse();
 *  })
 */
export const usingLoginMiddleware = (
  callback: MiddlewareCallbackWithNullUser
) => {
  return cache(async (request: NextRequest) => {
    try {
      const cookies = await requestCookies();
      const cookie = cookies.get(lucia.sessionCookieName);
      if (cookie?.value) {
        const { user, session } = await lucia.validateSession(cookie.value);
        const userData = await db.query.usersTable.findFirst({
          where: sql`id = ${user?.id}`,
        });
        if (session && session.fresh) {
          const sessionCookie = lucia.createSessionCookie(session.id);
          cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );
        }

        if (!session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );
          return await callback(request, null);
        }

        return await callback(request, userData);
      } else {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
        return await callback(request, null);
      }
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
  });
};
