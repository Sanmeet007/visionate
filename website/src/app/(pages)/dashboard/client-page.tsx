"use client";

import { Image as ImageIcon, Key as KeyIcon } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wait from "@/utils/wait";
import { useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import StatsTile from "./components/Stats/StatsTile";
import QuotaTile from "./components/Stats/QuotaTile";
import RequestsAnalysis from "./components/Stats/RequestsAnalysis";
import WeeklyAverage from "./components/Stats/WeeklyAverage";
import UsageMetrics from "./components/Stats/UsageMetrics";
import { formatBytes } from "@/utils/format-bytes";
import CenteredBox from "@/app/components/CenteredBox";

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

const periodValues = [
  "today",
  "yesterday",
  "this-week",
  "past-week",
  "this-month",
  "past-month",
  "past-three-months",
  "past-six-months",
  "this-year",
  "past-year",
];
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
    isError: isBaseStatsError,
    error: baseStatsError,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/data/base-stats`
      );
      const data = await res.json();
      return {
        keysLeft: data.keysLeft,
        maxAllowedKeys: data.maxAllowedKeys,
        averageImageSIze: data.avgImageSize,
        requestsRemaining: data.requestsRemaining,
        requestThisMonth: data.requestThisMonth,
        maxRequestsPerMonth: data.maxRequestsPerMonth,
        requestsProcessed: {
          success: data.requestsProcessed.success,
          fail: data.requestsProcessed.fail,
        },
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/data/weekly-metrics`
      );
      const data = await res.json();
      return {
        keys: [
          "Sunday:",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        values: [
          data.data["Sunday"],
          data.data["Monday"],
          data.data["Tuesday"],
          data.data["Wednesday"],
          data.data["Thursday"],
          data.data["Friday"],
          data.data["Saturday"],
        ] as Array<number>,
      };
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/data/usage-metrics?period=${usageMetricsParams.period}`
      );
      const data = await res.json();
      return {
        period: usageMetricsParams.period,
        ...data,
      };
    },
    queryKey: [`usage-metrics-data-${user?.id}`, usageMetricsParams],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const periodChangeHandler = (e: SelectChangeEvent<Period>) => {
    setUsageMetricsParams({ period: e.target.value as Period });
  };

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
            {!isFetchingBaseStats && !isBaseStatsError && (
              <>
                <StatsTile
                  icon={KeyIcon}
                  title={"KEYS REMAINING"}
                  value={`${basicDashStats!.keysLeft}/${
                    basicDashStats!.maxAllowedKeys
                  }`}
                />
                <StatsTile
                  icon={ImageIcon}
                  title={"AVG IMAGE SIZE"}
                  value={formatBytes(basicDashStats!.averageImageSIze)}
                />
                <QuotaTile
                  value={basicDashStats!.requestThisMonth}
                  max={
                    basicDashStats!.maxRequestsPerMonth *
                    basicDashStats!.maxAllowedKeys
                  }
                />
              </>
            )}
            {!isFetchingBaseStats && isBaseStatsError && (
              <CenteredBox>
                <Typography variant="body2" color="error">
                  Ah snap! Something went wrong while fetching base stats data.
                </Typography>
              </CenteredBox>
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
          {!isFetchingMetrics && !isErrorInMetrics && (
            <Box
              sx={{
                bgcolor: "rgb(71 60 102 / 33%)",
                minHeight: "200px",
                borderRadius: "20px",
                p: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Box>Displaying {metricsData.dataFormatType} based data</Box>
                <Box sx={{ maxWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="usage-metric-label">Period</InputLabel>
                    <Select
                      labelId={"usage-metric-label"}
                      id={"usage-metric-selector"}
                      value={usageMetricsParams.period}
                      label={"Period"}
                      onChange={periodChangeHandler}
                      sx={{
                        "& .MuiSelect-outlined": {
                          py: "0.5rem",
                        },
                        borderRadius: "100px",
                      }}
                    >
                      {periodValues?.map((v, index) => {
                        return (
                          <MenuItem key={"select-item-" + index} value={v}>
                            {v}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <UsageMetrics metricsData={metricsData} />
            </Box>
          )}

          {!isFetchingMetrics && isErrorInMetrics && (
            <CenteredBox>
              <Typography variant="body2" color="error">
                Ah snap! Something went wrong while fetching usage metrics data.
              </Typography>
            </CenteredBox>
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
          {!isFetchingBaseStats && !isBaseStatsError && (
            <Box>
              <RequestsAnalysis
                success={basicDashStats!.requestsProcessed.success}
                fail={basicDashStats!.requestsProcessed.fail}
              />
            </Box>
          )}
          {!isFetchingBaseStats && isBaseStatsError && (
            <CenteredBox>
              <Typography variant="body2" color="error">
                Ah snap! Something went wrong while fetching request analysis
                data.
              </Typography>
            </CenteredBox>
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
          {!isFetchingWeeklyAverage && !isErorrInWeeklyAverage && (
            <Box>
              <WeeklyAverage data={weeklyAverage!} />
            </Box>
          )}
          {!isFetchingWeeklyAverage && isErorrInWeeklyAverage && (
            <>
              <CenteredBox>
                <Typography variant="body2" color="error">
                  Error fetching weekly average data
                </Typography>
              </CenteredBox>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DashboardClientPage;
