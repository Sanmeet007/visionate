"use client";

import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "../fragments/Header";
import Footer from "../fragments/Footer";

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <Box className="constrained-container">
        <Box
          sx={{
            scrollbarGutter: "stable both-edges",
          }}
        >
          <Header />
          <Box
            component={"main"}
            sx={{
              minHeight: "calc(100vh - 80px - 160px) ",
              px: "2rem",
            }}
          >
            {pathname !== "/" && (
              <Box
                sx={{
                  mt: "calc(70px + 1rem)",
                }}
              ></Box>
            )}

            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default FrontLayout;
