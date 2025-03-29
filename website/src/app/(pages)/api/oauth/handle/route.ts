export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/drizzle";
import { eq } from "drizzle-orm";
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { loginAttemptsTable } from "@/drizzle/schema";
import { usersTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    const oauth = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.NEXT_PUBLIC_ORIGIN + "/api/oauth/handle",
    });

    const code = request.nextUrl.searchParams.get("code");

    if (code == null) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid request",
        },
        {
          status: 400,
        }
      );
    }

    const r = await oauth.getToken(code);
    await oauth.setCredentials(r.tokens);

    const access_token = oauth.credentials.access_token;

    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    const { email, name, email_verified, picture } = data;

    let redirectURL = "/dashboard";

    let user = await db.query.usersTable.findFirst({
      where: (table) => eq(table.email, email),
    });

    if (user) {
      redirectURL = "/dashboard";
    } else {
      redirectURL = "/sign-up/onboarding";
    }

    if (!user) {
      const userId = generateId(15);

      await db.insert(usersTable).values({
        id: userId,
        name,
        email,
        emailVerified: email_verified,
        profileImage: picture,
      });

      const [newUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      user = newUser;
    }

    // if (!) {
    //   // NEW USER REGISTERED
    //   sendTemplateEmail({
    //     template: "get_started",
    //     receivers: [user.email],
    //     params: {
    //       USERNAME: user.name,
    //     },
    //   }).catch((_) => {
    //     console.log("Error sending get started mail");
    //   });
    // }

    const response = new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Redirecting...</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark light"/>
          <link rel="icon" href="/favicon-light.png" media="(prefers-color-scheme: light)">
          <link rel="icon" href="/favicon-dark.png" media="(prefers-color-scheme: dark)">
          <style>
            body{
              min-height:100vh;
              min-height:100svh;
              display:grid;
              place-items:center;
              overflow:hidden;
            }
          </style>
        </head>
        <body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="143px" height="143px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="21" stroke-width="4" stroke="#007878" stroke-dasharray="32.98672286269283 32.98672286269283" fill="none" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
            </svg>

          <script>
            setTimeout(() => {
                window.location.href = "${redirectURL}";
            }, 2000);
          </script>
        </body>
      </html>
    `,
      {
        status: 301,
      }
    );

    const session = await lucia.createSession(user.id, {
      expiresIn: 3600 * 24 * 30, // 30 days a session
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    await db.insert(loginAttemptsTable).values({
      userId: user.id,
      ipAddress:
        request.headers.get("X-Real-IP") ||
        request.headers.get("X-Forwarded-For"),
      deviceName: request.headers.get("User-Agent"),
      status: "success",
    });

    return response;
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: true,
      message: "Something went wrong",
    });
  }
}
