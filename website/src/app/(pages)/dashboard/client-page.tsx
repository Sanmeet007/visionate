"use client";

import { Image as ImageIcon, Key as KeyIcon } from "@mui/icons-material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { Box, Divider, Typography } from "@mui/material";
import QuotaBar from "./components/QuotaBar";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieCenterLabel } from "./components/PieCenterLabel";

const DashboardClientPage = () => {
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
              "& > div": {
                bgcolor: "rgb(71 60 102 / 33%)",
                borderRadius: "20px",
                p: "1rem",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <KeyIcon fontSize="large" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: "1",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Typography
                  sx={{
                    maxWidth: "200px",
                  }}
                >
                  KEYS REMAINING
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  0/10
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <ImageIcon fontSize="large" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: "1",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Typography
                  sx={{
                    maxWidth: "200px",
                  }}
                >
                  AVG IMAGE SIZE
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  20 KB
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <DataUsageIcon fontSize="large" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: "1",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      maxWidth: "200px",
                    }}
                  >
                    QUOTA REMAINING
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "right",
                    }}
                  >
                    20/100
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: "column",
                    mt: "0.5rem",
                  }}
                >
                  <QuotaBar />
                </Box>
              </Box>
            </Box>
          </Box>
          <Typography>Usage metrics</Typography>

          <Box
            sx={{
              bgcolor: "rgb(71 60 102 / 33%)",
              minHeight: "200px",
              borderRadius: "20px",
              p: "1rem",
            }}
          >
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={300}
              grid={{ vertical: true, horizontal: true }}
            />
          </Box>
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
          <Box>
            <PieChart
              series={[
                {
                  faded: { innerRadius: 30, additionalRadius: -30 },
                  data: [
                    { id: 0, value: 100, label: "Success" },
                    { id: 1, value: 15, label: "Fail" },
                  ],
                  innerRadius: 70,
                  outerRadius: 50,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  startAngle: -180,
                  endAngle: 180,
                },
              ]}
              width={200}
              height={200}
            >
              <PieCenterLabel>GOOD</PieCenterLabel>
            </PieChart>
          </Box>

          <Typography>Weekly Average</Typography>
          <Box>
            <BarChart
              sx={{
                ml: "0",
              }}
              xAxis={[
                {
                  id: "barCategories",
                  data: ["MON", "TUE", "WED", "THR", "FRI", "SAT", "SUN"],
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: [2, 5, 3, 2, 2, 5, 6],
                },
              ]}
              height={200}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardClientPage;
