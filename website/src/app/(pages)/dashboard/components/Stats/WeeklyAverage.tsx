import { BarChart } from "@mui/x-charts/BarChart";
import { upperCase } from "lodash";

const WeeklyAverageGraph = ({
  data,
}: {
  data: {
    keys: string[];
    values: number[];
  };
}) => {
  return (
    <>
      <BarChart
        sx={{
          ml: "0",
        }}
        xAxis={[
          {
            id: "barCategories",
            data: data.keys.map((x) => upperCase(x.slice(0, 3))),
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: data.values,
          },
        ]}
        height={200}
      />
    </>
  );
};

export default WeeklyAverageGraph;
