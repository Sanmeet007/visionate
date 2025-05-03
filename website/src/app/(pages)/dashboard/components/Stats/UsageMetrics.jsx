import { LineChart } from "@mui/x-charts/LineChart";
import { Box } from "@mui/material";

const UsageMetricsGraph = () => {
  return (
    <>
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
    </>
  );
};

export default UsageMetricsGraph;
