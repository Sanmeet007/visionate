"use client";

import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CustomLinearProgress(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

export default function QuotaBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <CustomLinearProgress
        value={(value / max) * 100}
        sx={{
          height: "20px",
          borderRadius: "20px",
        }}
      />
    </Box>
  );
}
