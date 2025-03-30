import { db } from "@/drizzle";
import { apiKeysTable } from "@/drizzle/schema";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { eq } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

interface RequestData {
  apiKey: string;
}

export const GET = usingJoiValidatorMiddleware(
  async (_, validatedData) => {
    const apiKey = validatedData.urlData!.apiKey;

    try {
      const apiKeys = await db.query.apiKeysTable.findFirst({
        where: eq(apiKeysTable.apiKey, apiKey),
      });

      if (!apiKeys) {
        return NextResponse.json({
          error: true,
          message: "Invalid api Key",
        });
      }
      if (apiKeys?.isActive) {
        return NextResponse.json({
          error: true,
          message: "Api key not active",
        });
      } else {
        return NextResponse.json({
          error: false,
          message: "Api key is valid",
        });
      }
    } catch (e: unknown) {
      if (Number(process.env.LOGGING_LEVEL) > 0) {
        console.error(e);
      }

      return NextResponse.json(
        {
          error: true,
          message: "Something went wrong",
        },
        { status: 500 }
      );
    }
  },
  {
    getDataFrom: "URL",
    validationSchema: {
      url: Joi.object<RequestData>({
        apiKey: Joi.string().required().length(64),
      }),
    },
  }
);
