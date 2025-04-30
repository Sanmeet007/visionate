"use client";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next-nprogress-bar";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import PricingTiers from "./components/PricingCard";
import wait from "@/utils/wait";
import { usersTable } from "@/drizzle/schema";

const OnboardingClientPage = () => {
  const showSnackbar = useSnackbar();
  const { user, setUser } = useUser();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedTier, setTier] =
    useState<typeof usersTable.$inferSelect.subscriptionType>("free");

  const handleTierChange = (
    tier: typeof usersTable.$inferSelect.subscriptionType
  ) => {
    setTier(tier);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    if (selectedTier === "free") {
      await wait(2000);
    } else {
      // TODO :  process payment and update the subscrpition type user
      // await fetch(`${process.env.REUQUEST_ORIGIN}/api/`)
    }

    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subscriptionType:
          selectedTier as typeof usersTable.$inferSelect.subscriptionType,
      };
    });

    setIsProcessing(false);

    setIsDisabled(true);
    router.push("/dashboard");
  };

  return (
    <>
      <Backdrop
        transitionDuration={300}
        open={isProcessing}
        sx={{
          backdropFilter: "blur(10px)",
          zIndex: "100",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="h5">Processing</Typography>
          </Box>
          <Box sx={{ width: "25vw" }}>
            <LinearProgress
              sx={{
                borderRadius: "100px",
              }}
              color="inherit"
            />
          </Box>
        </Box>
      </Backdrop>

      <Box>
        <Box
          sx={{
            p: "2rem",
          }}
        >
          <Box
            sx={{
              my: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component={"h1"}
              sx={{
                maxWidth: "500px",
              }}
            >
              Choose your plan
            </Typography>
            <Box
              sx={{
                my: "2rem",
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(3,1fr)",
                gridAutoRows: "1fr",
                maxWidth: "1000px",
              }}
            >
              <PricingTiers
                onSelectChange={handleTierChange}
                selectedTier={selectedTier}
              />
            </Box>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ borderRadius: "100px", textTransform: "none" }}
              onClick={handleSubmit}
              disabled={isDisabled}
              endIcon={<NavigateNextIcon />}
              disableElevation
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OnboardingClientPage;
