import { Box } from "@mui/material";
import Header from "../../fragments/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "@/app/fragments/Footer";
import FaqSection from "./components/FaqSection";
import HeroPricingTiers from "./components/PricingTiers";

const ClientHomePage = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          isolation: "isolate",

          "& section": {
            px: "2rem",
          },
        }}
      >
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HeroPricingTiers />
        <FaqSection />
        <Footer />
      </Box>
    </>
  );
};

export default ClientHomePage;
