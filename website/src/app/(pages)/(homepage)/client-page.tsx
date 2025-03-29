import { Box } from "@mui/material";
import Header from "./components/Header";
import DecorationImage from "./components/DecorationImage";
import HeroSection from "./components/HeroSection";
import BlurCircleGraphic from "./components/BlurCircleGraphic";
import LinesGraphic from "./components/LinesGraphic";

const ClientHomePage = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          isolation: "isolate",
        }}
      >
        <Header />
        <DecorationImage />
        <BlurCircleGraphic />
        <LinesGraphic />
        <HeroSection />
      </Box>
    </>
  );
};

export default ClientHomePage;
