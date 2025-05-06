"use client";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "@bprogress/next/app";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import PricingTiers from "./components/PricingCard";
import wait from "@/utils/wait";
import { usersTable } from "@/drizzle/schema";
import subscriptionPricing from "@/utils/sub-pricing";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  const createOrderId = async (
    subscriptionType: string,
    currency: string = "INR"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/payments/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionType,
            currency,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      let shouldAskPayment = true;

      setIsProcessing(true);
      setIsDisabled(true);

      if (selectedTier === "free") {
        shouldAskPayment = false;
      }

      if (shouldAskPayment) {
        const amount = subscriptionPricing[selectedTier].price * 100; // in paise
        const orderId: string = await createOrderId(selectedTier);
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: "INR",
          name: user!.name,
          readonly: { email: true },
          prefill: { email: user!.email },
          description: "description",
          order_id: orderId,
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setIsDisabled(false);
            },
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            const data = {
              orderCreationId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const paymentResponse = await fetch(
              `${process.env.NEXT_PUBLIC_ORIGIN}/api/payments/verify`,
              {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              }
            );
            const paymentResponseData = await paymentResponse.json();

            if (paymentResponseData.isOk) {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active/complete-onboarding`
              );

              if (res.ok) {
                setIsProcessing(false);

                setUser((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    subscriptionType:
                      selectedTier as typeof usersTable.$inferSelect.subscriptionType,
                    onboardingCompleted: new Date(),
                  };
                });
                showSnackbar("success", "Thank you for subscribing!");
                router.push("/dashboard");
              } else {
                setIsProcessing(false);
                setIsDisabled(false);
                showSnackbar("error", "Ah! Something went wrong");
              }
            } else {
              setIsProcessing(false);
              setIsDisabled(false);
              showSnackbar(
                "error",
                paymentResponseData?.message || "Ah! Error processing payment"
              );
            }
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          setIsProcessing(false);
          setIsDisabled(false);
          showSnackbar(
            "error",
            response?.error?.description || "Ah! Error processing payment"
          );
        });

        paymentObject.open();
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active/complete-onboarding`
        );

        if (res.ok) {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              subscriptionType:
                selectedTier as typeof usersTable.$inferSelect.subscriptionType,
              onboardingCompleted: new Date(),
            };
          });

          router.push("/dashboard");
        } else {
          setIsProcessing(false);
          setIsDisabled(false);
          showSnackbar("error", "Ah! Something went wrong");
        }
      }
    } catch (e) {
      if (Number(process.env.LOGGING_LEVEL) > 0) {
        console.error(e);
      }

      setIsProcessing(false);
      setIsDisabled(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
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
