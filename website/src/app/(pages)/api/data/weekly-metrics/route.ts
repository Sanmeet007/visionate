import { db } from "@/drizzle";
import { apiRequestsTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { and, count, sql, eq, avg } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

interface GetRequestParams {}

export const GET = usingAuthMiddleware(
  usingJoiValidatorMiddleware<GetRequestParams>(
    async (_, validationResults, user) => {
      const {} = validationResults.urlData!;
      const weeklyCountsResult = await db
        .select({
          day: sql<string>`dayname(${apiRequestsTable.timestamp})`.as("day"),
          week: sql<number>`week(${apiRequestsTable.timestamp})`.as("week"),
          requests_count: count(apiRequestsTable.id).as("requests_count"),
        })
        .from(apiRequestsTable)
        .where(
          and(
            eq(apiRequestsTable.userId, user!.id),
            sql`month(${apiRequestsTable.timestamp}) = month(current_timestamp)`
          )
        )
        .groupBy(
          sql`dayname(${apiRequestsTable.timestamp})`,
          sql`week(${apiRequestsTable.timestamp})`
        );

      const uniqueWeeks = [
        ...new Set(weeklyCountsResult.map((row) => row.week)),
      ];
      const numberOfWeeksWithData = uniqueWeeks.length;

      if (numberOfWeeksWithData === 0) {
        return NextResponse.json({
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        });
      }

      const dailyRequestCounts: Record<string, number[]> = {};
      weeklyCountsResult.forEach((row) => {
        if (!dailyRequestCounts[row.day]) {
          dailyRequestCounts[row.day] = Array(numberOfWeeksWithData).fill(0);
        }
        const weekIndex = uniqueWeeks.indexOf(row.week);
        if (weekIndex !== -1) {
          dailyRequestCounts[row.day][weekIndex] = row.requests_count;
        }
      });

      const trueAverageRequestsByDay: Record<string, number> = {};
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      daysOfWeek.forEach((day) => {
        const totalRequests =
          dailyRequestCounts[day]?.reduce((sum, count) => sum + count, 0) || 0;
        trueAverageRequestsByDay[day] = Math.floor(
          totalRequests / numberOfWeeksWithData
        );
      });

      return NextResponse.json({ data: trueAverageRequestsByDay });
    },
    {
      getDataFrom: "URL",
      validationSchema: {
        url: Joi.object({}),
      },
    }
  )
);
