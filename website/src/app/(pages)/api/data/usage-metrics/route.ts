import { db } from "@/drizzle";
import { apiRequestsTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { and, count, sql } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

function getWeeksInMonth(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  return Math.ceil((daysInMonth + firstDayOfWeek) / 7);
}

interface GetRequestParams {
  period: string;
}

export const GET = usingAuthMiddleware(
  usingJoiValidatorMiddleware<GetRequestParams>(
    async (_, validationResults, user) => {
      try {
        const { period } = validationResults.urlData!;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const baseWhereClause = sql` user_id = ${user!.id}`;

        switch (period) {
          case "today":
            const todayResult = await db
              .select({
                hour: sql<number>`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`.as(
                  "hour"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`DATE(${apiRequestsTable.timestamp}) = CURRENT_DATE`
                )
              )
              .groupBy(
                sql`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`
              )
              .orderBy(
                sql`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`
              )
              .execute();
            const todayFormatted: Record<string, number> = {};

            for (let i = 0; i < 8; i++) {
              todayFormatted[`${i * 3}-${i * 3 + 3} hrs`] =
                todayResult.find((item) => item.hour === i)?.count || 0;
            }
            return NextResponse.json({
              period: "today",
              dataFormatType: "hours",
              requests: todayFormatted,
            });

          case "yesterday":
            const yesterdayResult = await db
              .select({
                hour: sql<number>`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`.as(
                  "hour"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`DATE(${apiRequestsTable.timestamp}) = date_sub(CURRENT_DATE , interval 1 day)`
                )
              )
              .groupBy(
                sql`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`
              )
              .orderBy(
                sql`CAST(HOUR(${apiRequestsTable.timestamp}) / 3 AS UNSIGNED)`
              )
              .execute();
            const yesterdayFromatted: Record<string, number> = {};

            for (let i = 0; i < 8; i++) {
              yesterdayFromatted[`${i * 3}-${i * 3 + 3} hrs`] =
                yesterdayResult.find((item) => item.hour === i)?.count || 0;
            }
            return NextResponse.json({
              period: "today",
              dataFormatType: "hours",
              requests: yesterdayFromatted,
            });

          case "this-week":
            const thisWeekResult = await db
              .select({
                day: sql<number>`DAYOFWEEK(${apiRequestsTable.timestamp})`.as(
                  "day"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`WEEK(${apiRequestsTable.timestamp}, 1) = WEEK(CURRENT_DATE, 1)`
                )
              )
              .groupBy(sql`DAYOFWEEK(${apiRequestsTable.timestamp})`)
              .execute();
            const thisWeekFormatted: Record<string, number> = {
              Monday: 0,
              Tuesday: 0,
              Wednesday: 0,
              Thursday: 0,
              Friday: 0,
              Saturday: 0,
              Sunday: 0,
            };
            const days = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            thisWeekResult.forEach((item) => {
              const day = days[item.day - 1];
              thisWeekFormatted[day] = item.count;
            });
            return NextResponse.json({
              period: "this-week",
              dataFormatType: "days",
              requests: thisWeekFormatted,
            });

          case "past-week":
            const pastWeekResult = await db
              .select({
                day: sql<number>`DAYOFWEEK(${apiRequestsTable.timestamp})`.as(
                  "day"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`WEEK(${apiRequestsTable.timestamp}, 1) = WEEK(CURRENT_DATE - INTERVAL 1 WEEK, 1)`
                )
              )
              .groupBy(sql`DAYOFWEEK(${apiRequestsTable.timestamp})`)
              .execute();
            const pastWeekFormatted: Record<string, number> = {
              Monday: 0,
              Tuesday: 0,
              Wednesday: 0,
              Thursday: 0,
              Friday: 0,
              Saturday: 0,
              Sunday: 0,
            };
            const pastDays = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            pastWeekResult.forEach((item) => {
              pastWeekFormatted[pastDays[item.day - 1]] = item.count;
            });
            return NextResponse.json({
              period: "past-week",
              dataFormatType: "days",
              requests: pastWeekFormatted,
            });

          case "this-month":
            const thisMonthRawResult = await db
              .select({
                week: sql<number>`WEEK(${apiRequestsTable.timestamp}, 1) - WEEK(DATE_SUB(CURRENT_DATE, INTERVAL DAYOFMONTH(CURRENT_DATE)-1 DAY), 1) + 1`.as(
                  "week"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`MONTH(${apiRequestsTable.timestamp}) = ${
                    month + 1
                  } AND YEAR(${apiRequestsTable.timestamp}) = ${year}`
                )
              )
              .groupBy(
                sql`WEEK(${apiRequestsTable.timestamp}, 1) - WEEK(DATE_SUB(CURRENT_DATE, INTERVAL DAYOFMONTH(CURRENT_DATE)-1 DAY), 1) + 1`
              )
              .execute();
            const weeksInThisMonth = getWeeksInMonth(year, month);
            const thisMonthFormatted: Record<string, number> = {};

            for (let i = 1; i <= weeksInThisMonth; i++) {
              thisMonthFormatted[i] =
                thisMonthRawResult.find((item) => item.week === i)?.count || 0;
            }

            return NextResponse.json({
              period: "this-month",
              dataFormatType: "weeks",
              requests: thisMonthFormatted,
            });

          case "past-month":
            const pastMonthDate = new Date(year, month - 1, 1);
            const pastYearForMonth = pastMonthDate.getFullYear();
            const pastMonthForData = pastMonthDate.getMonth();
            const pastMonthRawResult = await db
              .select({
                week: sql<number>`WEEK(${apiRequestsTable.timestamp}, 1) - WEEK(DATE_SUB(${pastMonthDate}, INTERVAL DAYOFMONTH(${pastMonthDate})-1 DAY), 1) + 1`.as(
                  "week"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`MONTH(${apiRequestsTable.timestamp}) = ${
                    pastMonthForData + 1
                  } AND YEAR(${
                    apiRequestsTable.timestamp
                  }) = ${pastYearForMonth}`
                )
              )
              .groupBy(
                sql`WEEK(${apiRequestsTable.timestamp}, 1) - WEEK(DATE_SUB(${pastMonthDate}, INTERVAL DAYOFMONTH(${pastMonthDate})-1 DAY), 1) + 1`
              )
              .execute();
            const weeksInPastMonth = getWeeksInMonth(
              pastYearForMonth,
              pastMonthForData
            );
            const pastMonthFormatted: Record<string, number> = {};

            for (let i = 1; i <= weeksInPastMonth; i++) {
              pastMonthFormatted[i] =
                pastMonthRawResult.find((item) => item.week === i)?.count || 0;
            }

            return NextResponse.json({
              period: "past-month",
              dataFormatType: "weeks",
              requests: pastMonthFormatted,
            });

          case "past-three-months":
            const pastThreeMonthsResult = await db
              .select({
                month: sql<number>`MONTH(${apiRequestsTable.timestamp})`.as(
                  "month"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`${apiRequestsTable.timestamp} >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)`
                )
              )
              .groupBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .orderBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .execute();
            const pastThreeMonthsFormatted: Record<string, number> = {};
            for (let i = 0; i < 3; i++) {
              const targetMonth = new Date(year, month - i, 1);
              pastThreeMonthsFormatted[
                new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                  targetMonth
                )
              ] =
                pastThreeMonthsResult.find(
                  (item) => item.month === targetMonth.getMonth() + 1
                )?.count || 0;
            }
            return NextResponse.json({
              period: "past-three-months",
              dataFormatType: "months",
              requests: pastThreeMonthsFormatted,
            });

          case "past-six-months":
            const pastSixMonthsResult = await db
              .select({
                month: sql<number>`MONTH(${apiRequestsTable.timestamp})`.as(
                  "month"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`${apiRequestsTable.timestamp} >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)`
                )
              )
              .groupBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .orderBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .execute();
            const pastSixMonthsFormatted: Record<string, number> = {};
            for (let i = 0; i < 6; i++) {
              const targetMonth = new Date(year, month - i, 1);
              pastSixMonthsFormatted[
                new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                  targetMonth
                )
              ] =
                pastSixMonthsResult.find(
                  (item) => item.month === targetMonth.getMonth() + 1
                )?.count || 0;
            }
            return NextResponse.json({
              period: "past-six-months",
              dataFormatType: "months",
              requests: pastSixMonthsFormatted,
            });

          case "this-year":
            const thisYearResult = await db
              .select({
                month: sql<number>`MONTH(${apiRequestsTable.timestamp})`.as(
                  "month"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`YEAR(${apiRequestsTable.timestamp}) = ${year}`
                )
              )
              .groupBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .orderBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .execute();
            const thisYearFormatted: Record<string, number> = {};
            for (let i = 0; i < 12; i++) {
              const monthName = new Intl.DateTimeFormat("en-US", {
                month: "short",
              }).format(new Date(year, i, 1));
              thisYearFormatted[monthName] =
                thisYearResult.find((item) => item.month === i + 1)?.count || 0;
            }
            return NextResponse.json({
              period: "this-year",
              dataFormatType: "months",
              requests: thisYearFormatted,
            });

          case "past-year":
            const pastYear = year - 1;
            const pastYearResult = await db
              .select({
                month: sql<number>`MONTH(${apiRequestsTable.timestamp})`.as(
                  "month"
                ),
                count: count(),
              })
              .from(apiRequestsTable)
              .where(
                and(
                  baseWhereClause,
                  sql`YEAR(${apiRequestsTable.timestamp}) = ${pastYear}`
                )
              )
              .groupBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .orderBy(sql`MONTH(${apiRequestsTable.timestamp})`)
              .execute();
            const pastYearFormatted: Record<string, number> = {};
            for (let i = 0; i < 12; i++) {
              const monthName = new Intl.DateTimeFormat("en-US", {
                month: "short",
              }).format(new Date(pastYear, i, 1));
              pastYearFormatted[monthName] =
                pastYearResult.find((item) => item.month === i + 1)?.count || 0;
            }
            return NextResponse.json({
              period: "past-year",
              dataFormatType: "months",
              requests: pastYearFormatted,
            });

          default:
            return NextResponse.json({ error: "Invalid period" });
        }
      } catch (error) {
        if (Number(process.env.LOGGING_LEVEL) >= 1) {
          console.error("Error in GET request:", error);
        }
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    {
      getDataFrom: "URL",
      validationSchema: {
        url: Joi.object({
          period: Joi.string()
            .valid(
              "today",
              "yesterday",
              "this-week",
              "past-week",
              "this-month",
              "past-month",
              "past-three-months",
              "past-six-months",
              "this-year",
              "past-year"
            )
            .default("today"),
        }),
      },
    }
  )
);
