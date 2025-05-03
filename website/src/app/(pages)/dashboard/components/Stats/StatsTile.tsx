import { Box, SvgIconTypeMap, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const StatsTile = ({
  title,
  value,
  icon: Icon,
}: {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  title: string;
  value: string;
}) => {
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
          <Icon fontSize="large" />
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
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default StatsTile;
