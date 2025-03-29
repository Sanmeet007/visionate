import { Box } from "@mui/material";
import Header from "./components/Header";
import DecorationImage from "./components/DecorationImage";
import HeroSection from "./components/HeroSection";

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
        <HeroSection />
      </Box>
    </>
  );
};

export default ClientHomePage;
