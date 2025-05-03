import { db } from "@/drizzle";
import { apiKeysTable, apiRequestsTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { getSubDetails } from "@/utils/user-sub-details";
import { and, avg, count, eq, sql } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

interface GetRequestParams {}

export const GET = usingAuthMiddleware(
  usingJoiValidatorMiddleware<GetRequestParams>(
    async (_, validationResults, user) => {
      try {
        const [d1Result, d2Result, d3Result, d4Result] = await Promise.all([
          db
            .select({
              avgImageSize: sql`ceil(avg(image_size))`.as("avgImageSize"),
            })
            .from(apiRequestsTable)
            .where(eq(apiRequestsTable.userId, user!.id))
            .limit(1),

          db
            .select({
              keyCount: count(apiKeysTable.id).as("keyCount"),
            })
            .from(apiKeysTable)
            .where(eq(apiKeysTable.userId, user!.id))
            .limit(1), // Optimization: Expecting a single row

          db
            .select({
              requestThisMonth: count(apiRequestsTable.id).as(
                "requestThisMonth"
              ),
            })
            .from(apiRequestsTable)
            .where(
              and(
                eq(apiRequestsTable.userId, user!.id),
                sql`month(\`timestamp\`) = month(current_timestamp)`
              )
            )
            .limit(1),

          db
            .select({
              processStatus: apiRequestsTable.processStatus,
              count: count(apiRequestsTable.id),
            })
            .from(apiRequestsTable)
            .groupBy(apiRequestsTable.processStatus)
            .where(
              and(
                eq(apiRequestsTable.userId, user!.id),
                sql`month(\`timestamp\`) = month(current_timestamp)`
              )
            ),
        ]);

        const formattedResult = {
          success: 0,
          fail: 0,
        };

        d4Result.forEach((item) => {
          const status = item.processStatus as string;
          const c = item.count;
          if (status === "success") {
            formattedResult.success += c;
          } else if (status === "fail") {
            formattedResult.fail += c;
          }
        });

        const { maxRequestsPerMonth } = getSubDetails(user!);

        return NextResponse.json({
          avgImageSize: Number(d1Result[0]?.avgImageSize ?? 0),
          keyCount: d2Result[0]?.keyCount ?? 0,
          requestsRemaining:
            maxRequestsPerMonth - (d3Result[0]?.requestThisMonth ?? 0),
          requestsProcessed: formattedResult,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
          { error: true, message: "Something went wrong" },
          { status: 500 }
        );
      }
    },
    {
      getDataFrom: "URL",
      validationSchema: {
        url: Joi.object({}),
      },
    }
  )
);
