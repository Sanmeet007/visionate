export const dynamic = "force-dynamic";

import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { eq } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";
import { lucia } from "@/auth";
import { cookies as requestCookies } from "next/headers";
import { error } from "console";

export const GET = usingAuthMiddleware((_, user) => {
  return NextResponse.json({ ...user, hashedPassword: null });
});

interface PutRequestData {
  name: string | null;
}

export const PUT = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<PutRequestData>(
      async (_, validationResults, user) => {
        try {
          const { name } = validationResults.bodyData!;

          await db
            .update(usersTable)
            .set({ name })
            .where(eq(usersTable.id, user!.id));

          return NextResponse.json({
            message: "User details updated successfully",
          });
        } catch (error) {
          if (Number(process.env.LOGGING_LEVEL) >= 1) {
            console.error("Error updating user details:", error);
          }

          return NextResponse.json(
            {
              message: "Failed to update user details",
            },
            { status: 500 }
          );
        }
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            name: Joi.string().min(3).max(100).required(),
          }),
        },
      }
    )
  )
);

export const DELETE = usingAuthMiddleware(
  usingEmailVerificationMiddleware(async (_, user) => {
    try {
      const cookies = await requestCookies();
      await db.delete(usersTable).where(eq(usersTable.id, user!.id));

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
        message: "User account deleted successfully",
      });
    } catch (error) {
      if (Number(process.env.LOGGING_LEVEL) >= 1) {
        console.error("Error deleting user account:", error);
      }

      return NextResponse.json(
        {
          error: true,
          message: "Failed to delete user account",
        },
        { status: 500 }
      );
    }
  })
);
