import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/razorpay";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usersTable } from "@/drizzle/schema";
import subscriptionPricing from "@/utils/sub-pricing";

interface PutRequestBody {
  subscriptionType: typeof usersTable.$inferSelect.subscriptionType;
  currency: string;
}
export const POST = usingAuthMiddleware(
  usingEmailVerificationMiddleware(
    usingJoiValidatorMiddleware<PutRequestBody>(
      async (_, v, user) => {
        try {
          const { subscriptionType, currency } = v.bodyData!;
          const amount = subscriptionPricing[subscriptionType].price * 100; // in paise

          const options = {
            amount: amount,
            currency: currency,
            receipt: "rcp1",
          };

          const order = await razorpay.orders.create(options);
          return NextResponse.json({ orderId: order.id }, { status: 200 });
        } catch (error) {
          console.error("Error creating order:", error);
          return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
          );
        }
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            subscriptionType: Joi.string()
              .valid(...usersTable.subscriptionType.enumValues)
              .required(),
            currency: Joi.string().valid("INR", "USD").default("INR"),
          }),
        },
      }
    )
  )
);
