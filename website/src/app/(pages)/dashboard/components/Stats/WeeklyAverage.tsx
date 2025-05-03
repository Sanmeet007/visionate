import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/material";

const WeeklyAverageGraph = () => {
  return (
    <>
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
    </>
  );
};

export default WeeklyAverageGraph;
