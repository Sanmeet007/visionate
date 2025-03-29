import { Box, Typography } from "@mui/material";

const GraphicHeading = ({ text }: { text: string }) => {
  return (
    <>
      <Box
        sx={{
          backgroundImage: "url(/images/pattern.png)",
          padding: "2rem",
          textAlign:"center",
        }}
      >
        <Typography variant="h6">{text}</Typography>
      </Box>
    </>
  );
};

export default GraphicHeading;
