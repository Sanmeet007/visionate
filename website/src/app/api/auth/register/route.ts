/**
 *
 * ROUTE: /api/auth/register
 * ALLOWED METHODS: POST
 *
 * --------------------
 * POST : ( email: string , password: string )
 *  API route to register user using email and password
 *    - If valid, returns a session cookie and starts the session
 * --------------------
 */

import { NextResponse } from "next/server";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { cookies as requestCookies } from "next/headers";
import { generatePasswordHash } from "@/utils/auth-utilities";
import { usingLoginMiddleware } from "@/middlewares/authenticator";
import { eq } from "drizzle-orm";

interface BodyRouteParams {
  email: string;
  password: string;
}

export const POST = usingLoginMiddleware(
  usingJoiValidatorMiddleware<BodyRouteParams>(
    async (_, validationResults, loggedInUser) => {
      try {
        const cookies = await requestCookies();
        if (loggedInUser) {
          return NextResponse.json(
            { error: true, message: "Already logged in" },
            { status: 400 }
          );
        }
        const { email, password } = validationResults.bodyData!;
        const hashedPassword = await generatePasswordHash(password);
        const userId = generateId(15);

        await db.insert(usersTable).values({
          id: userId,
          email,
          hashedPassword,
        });

        const [newUser] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, userId));

        const session = await lucia.createSession(userId, {
          expiresIn: 3600 * 24 * 30, // 30 days a session
        });
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        const returningUser = { ...newUser };
        returningUser.hashedPassword = null;

        return NextResponse.json({
          error: false,
          message: "Login success",
          user: returningUser,
        });
      } catch (e: unknown) {
        const error = e as { code: string };
        if (error?.code && error?.code === "ER_DUP_ENTRY") {
          return NextResponse.json(
            {
              error: true,
              message: "Email address already registered",
            },
            {
              status: 400,
            }
          );
        }

        if (Number(process.env.LOGGING_LEVEL) > 0) {
          console.log(e);
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
    },
    {
      getDataFrom: "BODY",
      validationSchema: {
        body: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    }
  )
);
