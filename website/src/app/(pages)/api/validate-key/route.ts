import { db } from "@/drizzle";
import { apiKeysTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const apiKey = headers().get("X-API-KEY");

    if (!apiKey)
      return NextResponse.json(
        {
          error: true,
          message: "Invalid api key",
        },
        {
          status: 400,
        }
      );

    const apiKeyDetails = await db.query.apiKeysTable.findFirst({
      where: eq(apiKeysTable.apiKey, apiKey),
    });

    if (!apiKeyDetails) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid api Key",
        },
        {
          status: 400,
        }
      );
    }
    if (!apiKeyDetails?.isActive) {
      return NextResponse.json(
        {
          error: true,
          message: "Api key not active",
        },
        {
          status: 400,
        }
      );
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
};
