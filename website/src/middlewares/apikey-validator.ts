// isvalidapikey_and_is_active_key

// Unlimited for enterprise
// 200 requests per month for premium
// 50 requests per month for free user

import { db } from "@/drizzle";
import { apiKeyUsageTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers as requestHeaders } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

interface MiddlewareCallback {
  (request: NextRequest): Promise<NextResponse> | NextResponse;
}

/**
 * Middleware function
 *  - Checks the request header to ensure it contains a valid working api key
 *
 * @example
 *  usingHasValidApiKeyMiddleware((request)=>{
 *    return new NextResponse()
 *  })
 */
export const usingHasValidApiKeyMiddleware = (callback: MiddlewareCallback) => {
  return cache(async (request: NextRequest) => {
    try {
      const headers = await requestHeaders();
      const apiKey = headers.get("X-API-KEY");
      if (apiKey != null) {
        const [record] = await db
          .select()
          .from(apiKeyUsageTable)
          .where(eq(apiKeyUsageTable.apiKey, apiKey));

        if (record) {
          if (record.isActive) {
            let hasReachedMaxLimit: boolean = false;
            switch (record.userSubscriptionType) {
              case "free":
                hasReachedMaxLimit = record.totalHits > 50;
                break;
              case "premium":
                hasReachedMaxLimit = record.totalHits > 200;
                break;
              case "enterprise":
                hasReachedMaxLimit = false;
                break;
            }

            if (hasReachedMaxLimit) {
              return NextResponse.json(
                {
                  error: true,
                  message:
                    "API request limit reached. Please upgrade your plan to continue.",
                },
                {
                  status: 403,
                }
              );
            }
          } else {
            return NextResponse.json(
              {
                error: true,
                message:
                  "This API key has been deactivated. Please contact support or generate a new key.",
              },
              {
                status: 403,
              }
            );
          }
        } else {
          return NextResponse.json(
            {
              error: true,
              message:
                "The provided API key is invalid. Please check and try again",
            },
            {
              status: 401,
            }
          );
        }

        return await callback(request);
      } else {
        return NextResponse.json(
          {
            error: true,
            message:
              "API key missing from headers. Please include a valid API key and try again.",
          },
          {
            status: 400,
          }
        );
      }
    } catch (e) {
      if (Number(process.env.LOGGING_LEVEL) > 0) {
        console.error(e);
      }
      return NextResponse.json(
        {
          error: true,
          message: "Something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  });
};
