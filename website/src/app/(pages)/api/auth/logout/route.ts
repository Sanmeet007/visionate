export const dynamic = 'force-dynamic';

/**
 *
 * ROUTE: /api/auth/logout
 * ALLOWED METHODS: GET
 *
 * --------------------
 * GET : ( None )
 * API route to perform signout
 *    - If valid, returns a blank session cookie expired immediately
 *    - Destroys current session
 * --------------------
 */

import { usingLoginMiddleware } from "@/middlewares/authenticator";
import { lucia } from "@/auth";
import { cookies as requestCookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = usingLoginMiddleware(async (_, loggedInUser) => {
  try {
    const cookies = await requestCookies();
    if (!loggedInUser) {
      return NextResponse.json(
        { error: true, message: "Invalid Request" },
        { status: 400 }
      );
    }

    const sessionId = cookies.get(lucia.sessionCookieName)!.value;
    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return NextResponse.json({
      error: false,
      message: "Logout success",
    });
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
