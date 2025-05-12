"use client";

import { Box } from "@mui/material";

const LinesGraphic = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "0",
          backgroundImage: "url(/images/lines-graphic.png)",
          backgroundSize: "500px 100px",
          backgroundPositionX: "100%",
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

export default LinesGraphic;
