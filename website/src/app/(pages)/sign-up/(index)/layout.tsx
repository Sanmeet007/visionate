"use client";

import Box from "@mui/material/Box";
import BgGraphic from "../components/BackgroundGraphic";

const SvgImage = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
      }}
    >
      <BgGraphic />
    </Box>
  );
};
const BareLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      className="constrained-container"
      sx={{
        height: "100svh",
        minHeight: "30rem",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        "& > div": {
          minHeight: "100px",
          minWidth: "100px",
        },

        "@media screen and (max-width: 600px)": {
          p: 0,
          gridTemplateColumns: "1fr",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#17132d",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          position: "relative",
          overflow: "hidden",

          "@media screen and (max-width: 600px)": {
            position: "fixed",
            inset: 0,
            scale: "1.2",
            zIndex: "-1",
          },
        }}
      >
        <SvgImage />
      </Box>
      <Box
        sx={{
          display: "grid",
          p: "1rem",
          placeItems: "center",
          overflowY: "auto",

          "@media screen and (max-width: 600px)": {
            p: "2rem",
            height: "max-content",
            my: "auto",
            mx: "2rem",
            borderRadius: "4px",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BareLayout;
