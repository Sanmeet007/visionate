import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { NextResponse } from "next/server";

export const GET = usingAuthMiddleware((_, user) => {
  return NextResponse.json({ ...user, hashedPassword: null });
});

interface PutRequestData {
  name: string | null;
}

export const PUT = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<PutRequestData>(
      (req, user) => {
        return NextResponse.json({
          message: "User details updated successfully",
        });
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
