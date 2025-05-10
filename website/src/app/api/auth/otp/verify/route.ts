import { NextResponse } from "next/server";
import Joi from "joi";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { redisDbClient as redis } from "@/app/redis/dbclient";
import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";

interface VerificationRecord {
  otp: number;
  created_at: number;
  tries: number;
  status: "pending" | "expired" | "failed" | "processed";
}

const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes
const ACCOUNT_LOCK_THRESHOLD = 3;
const BAN_THRESHOLD = 60 * 60 * 1000;

// Helper function to create a Redis key for verification records
const getVerificationRedisKey = (userId: string, type: string) =>
  `verification:verify:${userId}:${type}`;
const getLockRedisKey = (userId: string) => `verification:lock:${userId}`;

interface PostRequestParams {
  type: string;
  otp: number;
}

export const POST = usingAuthMiddleware(
  usingJoiValidatorMiddleware<PostRequestParams>(
    async (_, validationResults, user) => {
      try {
        const { type: verificationType, otp } = validationResults.bodyData!;

        if (user?.emailVerified) {
          return NextResponse.json(
            { error: true, message: "User already verified" },
            { status: 400 }
          );
        }

        const redisKey = getVerificationRedisKey(user!.id, verificationType);
        const verificationRecordString = await redis.get(redisKey);
        const verificationRecord: VerificationRecord | null =
          verificationRecordString
            ? JSON.parse(verificationRecordString)
            : null;

        if (verificationRecord) {
          const now = Date.now();
          const expired =
            (now - verificationRecord.created_at) / 1000 > OTP_EXPIRY_SECONDS;

          if (expired) {
            if (verificationRecord.tries >= ACCOUNT_LOCK_THRESHOLD - 1) {
              const now = Date.now();
              const banExpiryTime = now + BAN_THRESHOLD;

              await redis.setEx(
                getLockRedisKey(user!.id),
                60 * 60,
                JSON.stringify({
                  reason: "too_many_failed_attempts",
                  expiry: banExpiryTime,
                })
              );

              await redis.set(
                getVerificationRedisKey(user!.id, verificationType),
                JSON.stringify({
                  ...verificationRecord,
                  tries: verificationRecord.tries + 1,
                }),
                {
                  EX: OTP_EXPIRY_SECONDS,
                }
              );

              return NextResponse.json(
                {
                  error: true,
                  message:
                    "Too many unsuccessful attempts. Please try again after 1 hour.",
                },
                { status: 429 }
              );
            }
            await redis.set(
              redisKey,
              JSON.stringify({
                ...verificationRecord,
                status: "expired",
                tries: verificationRecord.tries + 1,
                created_at: now,
              }),
              {
                EX: OTP_EXPIRY_SECONDS,
              }
            );

            return NextResponse.json(
              {
                error: true,
                message: "OTP expired! Please request a new OTP and try again.",
              },
              { status: 400 }
            );
          } else {
            if (verificationRecord.otp === otp) {
              await redis.del(redisKey);

              await db.update(usersTable).set({
                emailVerified: new Date(),
              });

              // sendTemplateEmail({
              //   template: "verification_success",
              //   receivers: [user.email],
              //   params: {
              //     USERNAME: user.name,
              //   },
              // }).catch((e) => {
              //   if (process.env.NODE_ENV === "development") {
              //     console.log("Unable to send email", e);
              //   }
              // });

              return NextResponse.json({
                error: false,
                message: "Verification success",
              });
            } else {
              await redis.set(
                redisKey,
                JSON.stringify({
                  ...verificationRecord,
                  tries: verificationRecord.tries + 1,
                }),
                {
                  EX: OTP_EXPIRY_SECONDS,
                }
              );

              return NextResponse.json(
                { error: true, message: "Invalid otp" },
                { status: 400 }
              );
            }
          }
        } else {
          return NextResponse.json(
            { error: true, message: "No pending verification record found" },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
          { error: true, message: "Something went wrong" },
          { status: 500 }
        );
      }
    },
    {
      getDataFrom: "BODY",
      validationSchema: {
        body: Joi.object({
          type: Joi.string().required(),
          otp: Joi.number().required(),
        }),
      },
    }
  )
);
