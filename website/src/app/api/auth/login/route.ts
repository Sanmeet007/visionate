/**
 *
 * ROUTE: /api/auth/login
 * ALLOWED METHODS: POST
 *
 * --------------------
 * POST : ( email: string , password: string )
 *  API route to validate user using email and password
 *    - If valid, returns a session cookie and starts the session
 * --------------------
 */

import { NextResponse } from "next/server";
import { lucia } from "@/auth";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { verifyPassword } from "@/utils/auth-helpers";
import { db } from "@/drizzle";
import { eq } from "drizzle-orm";
import { cookies as requestCookies } from "next/headers";
import { usingLoginMiddleware } from "@/middlewares/authenticator";
import { usingContentTypeMiddleware } from "@/middlewares/content-type";
import { loginAttemptsTable } from "@/drizzle/schema";

interface BodyRouteParams {
  email: string;
  password: string;
  otp: number | null;
}

export const POST = usingLoginMiddleware(
  usingContentTypeMiddleware(
    usingJoiValidatorMiddleware<BodyRouteParams>(
      async (request, validationResults, loggedInUser) => {
        const cookies = await requestCookies();
        if (loggedInUser) {
          return NextResponse.json(
            {
              error: true,
              message: "Already logged in ",
            },
            { status: 400 }
          );
        }
        const { email, password } = validationResults.bodyData!;
        const user = await db.query.usersTable.findFirst({
          where: (table) => eq(table.email, email),
        });

        if (!user) {
          return NextResponse.json(
            {
              error: true,
              message: "Email id not registered",
            },
            { status: 400 }
          );
        }

        if (!user.hashedPassword) {
          return NextResponse.json(
            {
              error: true,
              message: "Account is manged by some 3rd party : Google etc",
            },
            { status: 400 }
          );
        }

        const isValidPassword = await verifyPassword(
          user.hashedPassword,
          password
        );

        if (isValidPassword) {
          const session = await lucia.createSession(user.id, {
            expiresIn: 3600 * 24 * 30, // 30 days a session
          });
          const sessionCookie = lucia.createSessionCookie(session.id);

          cookies.set(
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

          const returningUser = { ...user };
          returningUser.hashedPassword = null;

          return NextResponse.json({
            error: false,
            message: "Login success",
            user: returningUser,
          });
        } else {
          await db.insert(loginAttemptsTable).values({
            userId: user.id,
            ipAddress:
              request.headers.get("X-Real-IP") ||
              request.headers.get("X-Forwarded-For"),
            deviceName: request.headers.get("User-Agent"),
            status: "failed",
          });

          return NextResponse.json(
            {
              error: true,
              errorCode: "E_WRGPASS",
              message: "Invalid credentials",
            },
            { status: 400 }
          );
        }
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string(),
          }),
        },
      }
    ),
    "application/json"
  )
);
