import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { razorpay } from "@/razorpay";
import { apiRequestsTable, usersTable } from "@/drizzle/schema";
import { db } from "@/drizzle";
import { and, eq, sql } from "drizzle-orm";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

interface PostRequestBody {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  razorpayOrderId: string;
}

type userSubscriptionType = typeof usersTable.$inferSelect.subscriptionType;

export const POST = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<PostRequestBody>(
      async (_, validationResult, user) => {
        const { orderCreationId, razorpayPaymentId, razorpaySignature } =
          validationResult.bodyData!;

        const signature = generatedSignature(
          orderCreationId,
          razorpayPaymentId
        );
        if (signature !== razorpaySignature) {
          return NextResponse.json(
            { message: "payment verification failed", isOk: false },
            { status: 400 }
          );
        }

        const payment = await razorpay.payments.fetch(razorpayPaymentId);

        if (payment.status === "captured") {
          const userSubscriptionType = payment.notes
            .subscriptionType as userSubscriptionType;

          await db
            .update(usersTable)
            .set({
              subscriptionType: userSubscriptionType,
            })
            .where(eq(usersTable.id, user!.id));

          // Delete all the api requests of the user for the current month for fresh start as the user has upgraded to a new plan
          await db
            .delete(apiRequestsTable)
            .where(
              and(
                eq(apiRequestsTable.userId, user!.id),
                sql`month(timestamp) = month(current_date()) and year(timestamp) = year(current_date())`
              )
            );

          return NextResponse.json(
            { message: "Payment processed successfully", isOk: true },
            { status: 200 }
          );
        } else if (payment.status === "failed") {
          return NextResponse.json(
            { message: "Payment failed", isOk: false },
            { status: 402 }
          );
        } else {
          return NextResponse.json(
            { message: "Ah! Snap something went wrong", isOk: false },
            { status: 500 }
          );
        }
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            orderCreationId: Joi.string().required(),
            razorpayOrderId: Joi.string().required(),
            razorpayPaymentId: Joi.string().required(),
            razorpaySignature: Joi.string().required(),
          }),
        },
      }
    )
  )
);
