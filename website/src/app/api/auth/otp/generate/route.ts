// Only logined user can generate otp ! OTP IS 5 DIGIT
// ? Currently only supports email verification using otp
export const dynamic = "force-dynamic";

import { redisDbClient as redis } from "@/app/redis/dbclient";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { sendTemplateEmail } from "@/utils/mailer";
import randomInteger from "@/utils/rand-int";
import Joi from "joi";
import { NextResponse } from "next/server";

const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes in seconds

interface GetRequestParams {
  type: string;
}

interface VerificationRecord {
  otp: number;
  created_at: number;
}

export const GET = usingAuthMiddleware(
  usingJoiValidatorMiddleware<GetRequestParams>(
    async (_, validationResults, user) => {
      try {
        const { type } = validationResults.urlData!;

        if (user!.emailVerified) {
          return NextResponse.json(
            {
              error: false,
              message: "User already verfied",
            },
            {
              status: 400,
            }
          );
        }

        const redisKey = `verification:verify:${user!.id}:${type}`;
        const previousRecordString = await redis.get(redisKey);
        const previousRecord: VerificationRecord | null = previousRecordString
          ? JSON.parse(previousRecordString)
          : null;

        const newOTP = randomInteger(10_000, 99_999);
        const now = Date.now();

        if (!previousRecord) {
          await redis.set(
            redisKey,
            JSON.stringify({ otp: newOTP, created_at: now }),
            {
              EX: OTP_EXPIRY_SECONDS,
            }
          );

          await sendTemplateEmail({
            template: "otp",
            receivers: [user!.email],
            subject: "Verify Your Visionate Account (One-Time Password Inside)",
            params: {
              USERNAME: user!.name,
              OTP: newOTP,
            },
          });

          return NextResponse.json({
            error: false,
            message: "OTP sent successfully",
          });
        } else {
          const timeDifferenceMinutes = Math.floor(
            (now - previousRecord.created_at) / (1000 * 60)
          );

          if (timeDifferenceMinutes > 5) {
            await redis.set(
              redisKey,
              JSON.stringify({ otp: newOTP, created_at: now }),
              {
                EX: OTP_EXPIRY_SECONDS,
              }
            );

            await sendTemplateEmail({
              template: "otp",
              receivers: [user!.email],
              subject:
                "Verify Your Visionate Account (One-Time Password Inside)",
              params: {
                USERNAME: user!.name,
                OTP: newOTP,
              },
            });

            console.log("sending email: ", newOTP);

            return NextResponse.json({
              error: false,
              message: "OTP sent successfully",
            });
          } else {
            return NextResponse.json(
              {
                error: true,
                message: "Please wait for few minutes before re-trying",
              },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json(
          {
            error: true,
            message: "Something went wrong. Please try again later",
          },
          { status: 500 }
        );
      }
    },
    {
      getDataFrom: "URL",
      validationSchema: {
        url: Joi.object({
          type: Joi.string().valid("email").required(),
        }),
      },
    }
  )
);
