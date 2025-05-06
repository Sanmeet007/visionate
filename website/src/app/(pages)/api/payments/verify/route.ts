import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";

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

export const POST = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<PostRequestBody>(
      async (_, validationResult, user) => {
        const {
          orderCreationId,
          razorpayPaymentId,
          razorpaySignature,
        } = validationResult.bodyData!;

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
        return NextResponse.json(
          { message: "payment verified successfully", isOk: true },
          { status: 200 }
        );
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
