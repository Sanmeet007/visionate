import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { NextResponse } from "next/server";

interface GetRequestData {}

export const GET = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<GetRequestData>(
      async (req, user) => {
        await db.update(usersTable).set({
          onboardingCompleted: new Date(),
        });
        return NextResponse.json({
          message: "Onboarding completed successfully",
        });
      },
      {
        getDataFrom: "URL",
        validationSchema: {
          body: Joi.object({}),
        },
      }
    )
  )
);
