import DataUsageIcon from "@mui/icons-material/DataUsage";
import QuotaBar from "../QuotaBar";
import { Box, Typography } from "@mui/material";

const QuotaTile = ({ value, max }: { value: number; max: number }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          bgcolor: "rgb(71 60 102 / 33%)",
          borderRadius: "20px",
          p: "1rem",
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
    </>
  );
};

export default QuotaTile;
