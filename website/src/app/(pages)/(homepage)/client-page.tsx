import { Box } from "@mui/material";
import Header from "../../fragments/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";


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
        <HeroSection />
        <FeaturesSection />
      </Box>
    </>
  );
};

export default ClientHomePage;
