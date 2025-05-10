import crypto from "node:crypto";
import { db } from "@/drizzle";
import { passwordChangeHistoryTable } from "@/drizzle/schema";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { sendTemplateEmail } from "@/utils/mailer";
import { and, count, eq, sql } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";
import { redisDbClient as redis } from "@/app/redis/dbclient";

interface GetRquestParams {
  type: string;
  email: string;
}

export const GET = usingJoiValidatorMiddleware<GetRquestParams>(
  async (_, validationResults) => {
    try {
      const { type, email } = validationResults.urlData!;

      if (type !== "password") {
        return NextResponse.json(
          {
            error: true,
            message: "Invalid request",
          },
          { status: 400 }
        );
      }

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

      const [{ recordsCount }] = await db
        .select({
          recordsCount: count(),
        })
        .from(passwordChangeHistoryTable)
        .where(
          and(
            eq(passwordChangeHistoryTable.userId, user.id),
            sql`month(last_password_changed_at) = month(current_date()) and year(last_password_changed_at) = year(current_date())`
          )
        );

      if (recordsCount) {
        return NextResponse.json(
          {
            error: true,
            message: "You can only request a password reset once a month.",
          },
          { status: 400 }
        );
      }

      const token = crypto.randomBytes(32).toString("hex");
      await redis.set(`password-reset-request:${user.id}`, token, {
        EX: 60 * 60 * 1,
      });

      await db.insert(passwordChangeHistoryTable).values({
        userId: user.id,
        lastPasswordChangedAt: new Date(),
      });

      await sendTemplateEmail({
        template: "password-reset-request",
        receivers: [user.email],
        subject: "Attention Required: Password Reset Requested",
        params: {
          USERNAME: user.name,
          TOKEN: token,
        },
      });

      return NextResponse.json({
        error: false,
        message: "Password reset request sent successfully.",
      });
    } catch (error) {
      if (Number(process.env.LOGGING_LEVEL) >= 1) {
        console.log(error);
      }
      return NextResponse.json(
        {
          error: true,
          message: "An error occurred while generating the token.",
        },
        {
          status: 500,
        }
      );
    }
  },
  {
    getDataFrom: "URL",
    validationSchema: {
      url: Joi.object({
        type: Joi.string().valid("password").required(),
        email: Joi.string().email().required(),
      }),
    },
  }
);
