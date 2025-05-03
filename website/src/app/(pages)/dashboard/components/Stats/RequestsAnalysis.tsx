import { PieChart } from "@mui/x-charts/PieChart";
import { PieCenterLabel } from "../PieCenterLabel";
import { Box } from "@mui/material";

const RequestsAnalysisGraph = () => {
  return (
    <>
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
    </>
  );
};

export default RequestsAnalysisGraph;
