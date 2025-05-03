"use client";

import { Image as ImageIcon, Key as KeyIcon } from "@mui/icons-material";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wait from "@/utils/wait";
import { useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import StatsTile from "./components/Stats/StatsTile";
import QuotaTile from "./components/Stats/QuotaTile";
import RequestsAnalysis from "./components/Stats/RequestsAnalysis";
import WeeklyAverage from "./components/Stats/WeeklyAverage";
import UsageMetrics from "./components/Stats/UsageMetrics";

type Period =
  | "today"
  | "yesterday"
  | "this-week"
  | "past-week"
  | "this-month"
  | "past-month"
  | "past-three-months"
  | "past-six-months"
  | "this-year"
  | "past-year";

interface UsageQueryParams {
  period: Period;
}

const DashboardClientPage = () => {
  const { user } = useUser();
  const [usageMetricsParams, setUsageMetricsParams] =
    useState<UsageQueryParams>({
      period: "today",
    });

  const {
    data: basicDashStats,
    isLoading: isFetchingBaseStats,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      await wait(1000);
      return {
        keysLeft: 0,
        averageImageSIze: 1024,
        requestsRemaining: 56,
      };
    },
    queryKey: [`basic-stats-data-${user?.id}`],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const {
    data: weeklyAverage,
    isLoading: isFetchingWeeklyAverage,
    isError: isErorrInWeeklyAverage,
    error: weeklyAverageError,
  } = useQuery({
    queryFn: async () => {
      await wait(2000);
      return [10, 20, 20, 20, 20, 20, 20];
    },
    queryKey: [`weekly-average-data-${user?.id}`],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const {
    data: metricsData,
    isLoading: isFetchingMetrics,
    isError: isErrorInMetrics,
    error: metricsError,
  } = useQuery({
    queryFn: async () => {
      await wait(2500);
      // today , yesterday , this week , past week , this month , past month , past 3 months , past 6 months , this year , past year
      return {
        tenure: usageMetricsParams.period,
        // ?
      };
    },
    queryKey: [`usage-metrics-data-${user?.id}`, usageMetricsParams],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
          p: "1rem",
          "& > div": {
            minHeight: "200px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            "& > div": {
              width: "100%",
            },
          }}
        >
          <Typography>At Glance</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.5fr",
              gap: "1rem",
            }}
          >
            {isFetchingBaseStats && (
              <>
                <Skeleton
                  variant="rounded"
                  height={135}
                  animation="wave"
                  sx={{
                    borderRadius: "20px",
                  }}
                />

                <Skeleton
                  variant="rounded"
                  height={135}
                  animation="wave"
                  sx={{
                    borderRadius: "20px",
                  }}
                />
                <Skeleton
                  variant="rounded"
                  height={135}
                  animation="wave"
                  sx={{
                    borderRadius: "20px",
                  }}
                />
              </>
            )}
            {!isFetchingBaseStats && (
              <>
                <StatsTile
                  icon={KeyIcon}
                  title={"KEYS REMAINING"}
                  value={"0/10"}
                />
                <StatsTile
                  icon={ImageIcon}
                  title={"AVG IMAGE SIZE"}
                  value={"20 KB"}
                />
                <QuotaTile value={19} max={1000} />
              </>
            )}
          </Box>
          <Typography>Usage metrics</Typography>
          {isFetchingMetrics && (
            <>
              <Skeleton
                variant="rounded"
                height={350}
                animation="wave"
                sx={{
                  borderRadius: "20px",
                }}
              />
            </>
          )}
          {!isFetchingMetrics && (
            <Box
              sx={{
                bgcolor: "rgb(71 60 102 / 33%)",
                minHeight: "200px",
                borderRadius: "20px",
                p: "1rem",
              }}
            >
              <UsageMetrics />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            "& > div": {
              minHeight: "200px",
              bgcolor: "rgb(71 60 102 / 33%)",
              width: "100%",
              borderRadius: "20px",
              p: "1rem",
            },
          }}
        >
          <Typography>Request Analysis</Typography>
          {isFetchingBaseStats && (
            <>
              <Skeleton
                variant="rounded"
                height={200}
                animation="wave"
                sx={{
                  borderRadius: "20px",
                }}
              />
            </>
          )}
          {!isFetchingBaseStats && (
            <Box>
              <RequestsAnalysis />
            </Box>
          )}

          <Typography>Weekly Average This Month</Typography>
          {isFetchingWeeklyAverage && (
            <>
              <Skeleton
                variant="rounded"
                height={250}
                animation="wave"
                sx={{
                  borderRadius: "20px",
                }}
              />
            </>
          )}
          {!isFetchingWeeklyAverage && (
            <Box>
              <WeeklyAverage />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DashboardClientPage;
