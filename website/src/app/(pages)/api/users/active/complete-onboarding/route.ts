import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { eq } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

interface GetRequestData {}

export const GET = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<GetRequestData>(
      async (_, __, user) => {
        try {
          if (user?.onboardingCompleted) {
            return NextResponse.json({
              error: false,
              message: "Onboarding already completed",
            });
          }

          await db
            .update(usersTable)
            .set({
              onboardingCompleted: new Date(),
            })
            .where(eq(usersTable.id, user!.id));
          return NextResponse.json({
            message: "Onboarding completed successfully",
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
      },
      {
        getDataFrom: "URL",
        validationSchema: {
          url: Joi.object({}),
        },
      }
    )
  )
);
