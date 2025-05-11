export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { generatePasswordHash } from "@/utils/auth-helpers";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { db } from "@/drizzle";
import { passwordChangeHistoryTable, usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redisDbClient as redis } from "@/app/redis/dbclient";

interface PostRequestParams {
  token: string;
  email: string;
  password: string;
}

export const POST = usingJoiValidatorMiddleware<PostRequestParams>(
  async (_, validationResults) => {
    const { token, email, password } = validationResults.bodyData!;

    try {
      const user = await db.query.usersTable.findFirst({
        where: (table) => eq(table.email, email),
      });

      if (!user) {
        return NextResponse.json(
          {
            error: true,
            message: "Invalid request",
          },
          { status: 400 }
        );
      }

      const recordToken = await redis.get(`password-reset-request:${user.id}`);

      if (!recordToken) {
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

      if (recordToken === token) {
        await db
          .update(usersTable)
          .set({
            hashedPassword: await generatePasswordHash(password),
          })
          .where(eq(usersTable.id, user.id));

        await db.insert(passwordChangeHistoryTable).values({
          userId: user.id,
          lastPasswordChangedAt: new Date(),
        });
        
        await redis.del(`password-reset-request:${user.id}`);

        return NextResponse.json(
          {
            error: false,
            message: "Password reset successful",
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            error: true,
            message:
              "The password reset link appears to be expired or the token is invalid. Please request a new one.",
          },
          {
            status: 400,
          }
        );
      }
    } catch (e) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid token",
        },
        {
          status: 400,
        }
      );
    }
  },
  {
    getDataFrom: "BODY",
    validationSchema: {
      body: Joi.object({
        token: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(8)
          .max(128)
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .required(),
      }),
    },
  }
);
