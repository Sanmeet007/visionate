export const dynamic = "force-dynamic";

import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { sendTemplateEmail } from "@/utils/mailer";
import Joi from "joi";
import { NextResponse } from "next/server";

interface PostRequestParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const POST = usingJoiValidatorMiddleware<PostRequestParams>(
  async (_, validationResults) => {
    const { name, email, subject, message } = validationResults.bodyData!;

    await sendTemplateEmail({
      template: "support",
      subject: `Support Request Received - ${process.env.APP_NAME}`,
      receivers: [email],
      params: {
        USERNAME: name,
      },
    });

    await sendTemplateEmail({
      template: "incoming-support",
      subject: `Support Request: ${subject}`,
      receivers: [process.env.SMTP_USER!],
      params: {
        USERNAME: "Admin",
        SUBJECT: subject,
        CONTACT_EMAIL: email,
        CONTACT_NAME: name,
        CONTENT: message,
      },
    });

    return NextResponse.json({
      name,
      email,
      subject,
      message,
    });
  },
  {
    getDataFrom: "BODY",
    validationSchema: {
      body: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        subject: Joi.string().min(2).max(100).required(),
        message: Joi.string().min(2).max(1000).required(),
      }),
    },
  }
);
