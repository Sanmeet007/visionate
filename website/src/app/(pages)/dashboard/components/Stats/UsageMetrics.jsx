import { LineChart } from "@mui/x-charts/LineChart";
import { capitalize } from "lodash";

const UsageMetricsGraph = ({ metricsData }) => {
  return (
    <>
      <LineChart
        xAxis={[
          {
            label: capitalize(metricsData.dataFormatType),
            data: Object.keys(metricsData.requests).map((_, i) => i),
            scaleType: "point",
            valueFormatter: (i) => {
              if (i !== null) {
                return Object.keys(metricsData.requests)[i];
              } else {
                return "";
              }
            },
          },
        ]}
        series={[
          {
            data: Object.values(metricsData.requests),
          },
        ]}
        height={300}
        grid={{ vertical: true, horizontal: true }}
      />
    </>
  );
};

export default UsageMetricsGraph;
