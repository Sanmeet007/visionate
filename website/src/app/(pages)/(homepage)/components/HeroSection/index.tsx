"use client";

import { Box, Typography } from "@mui/material";

const HeroSection = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "calc(70px + 1rem)",
          }}
        ></Box>

        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              margin: 0,
              padding: 0,
              fontWeight: "bold",
              fontSize: (theme) => theme.typography.h3.fontSize,
              position: "relative",
              lineHeight: "1.1",
            }}
          >
            SEE THE UNSEEN.
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              maxWidth: "600px",
              color: "#D5D5D5",
            }}
          >
            Convert images into insightful and descriptive text with Visionate,
            enhancing web accessibility and enriching the digital experience for
            all.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HeroSection;
