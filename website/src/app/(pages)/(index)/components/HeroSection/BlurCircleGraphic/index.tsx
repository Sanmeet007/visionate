"use client";
import { Box } from "@mui/material";

const BlurCircleGraphic = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "0",
          backgroundImage: "url(/images/blur-circle-graphic.png)",
          backgroundSize: "700px 700px",
          backgroundPositionX: "0",
          backgroundRepeat: "no-repeat",
          width: "700px",
          height: "100vh",
          "@media screen and (max-width: 700px)": {
            width: "100%",
          },
        }}
      ></Box>
    </>
  );
};

export default BlurCircleGraphic;
