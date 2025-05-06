"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import EmailBgGraphpic from "./EmailBg";
import Typography from "@mui/material/Typography";

import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useUser } from "@/app/providers/UserProvider";
import { useRouter } from "@bprogress/next/app";

const VerifyEmailClientPage = () => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);

  const { user, setUser } = useUser();
  const showSnackbar = useSnackbar();
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [phase, setPhase] = useState(0);

  const handleOtpInputChange = (newValue: string) => {
    const MAX_OTP_LENGTH = 5; 
    const numericValue = newValue.replace(/\D/g, ""); 
    const truncatedValue = numericValue.substring(0, MAX_OTP_LENGTH); 

    setOtp(truncatedValue);
  };

  const resendOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    try {
      setIsResending(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/otp/generate?type=email`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsResending(false);
        setIsDisabled(false);
        setCanResend(false);

        showSnackbar("success", "OTP re-sent successfully");
      } else {
        setIsResending(false);
        setIsDisabled(false);

        showSnackbar("error", data.message || "Unable to send otp");
      }
    } catch (e) {
      console.log(e);
      setIsResending(false);
      setIsDisabled(false);

      showSnackbar("error", "Something went wrong");
    }
  };

  const handleOtpSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (otp.length === 5) {
      if (otp.split("").every((x) => !Number.isNaN(parseInt(x)))) {
        // Silence is golden
      } else {
        showSnackbar("warning", "Please enter a valid otp");
        return;
      }
    } else {
      showSnackbar("warning", "Please enter a valid otp");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/otp/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            type: "email",
            otp,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsProcessing(false);
        showSnackbar("success", "Account verified succesfully");
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            emailVerified: new Date(),
          };
        });
        router.push("/sign-up/onboarding");
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message || "Invalid otp");
      }
    } catch (e) {
      console.log(e);
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  const handleSendConfimation = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/otp/generate?type=email`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsProcessing(false);
        showSnackbar("success", "Confirmation sent successfully");
        setPhase(1);
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message || "Unable to send confirmation");
      }
    } catch (e) {
      console.log(e);
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  return (
    <>
      {user && (
        <Box>
          <Box component={"div"}>
            {phase === 0 && (
              <>
                <Box
                  sx={{
                    //   textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    maxWidth: "300px",
                    textAlign: "center",
                  }}
                >
                  <EmailBgGraphpic />
                  <Typography variant="h5">
                    We still need to confirm your email
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "InactiveCaptionText",
                    }}
                  >
                    should we send confirmation to{" "}
                    <Box
                      component={"span"}
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {user.email}
                    </Box>{" "}
                    ?
                  </Typography>
                  <LoadingButton
                    disabled={isDisabled || isProcessing}
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      fontSize: "1rem",
                    }}
                    onClick={handleSendConfimation}
                    variant="contained"
                    loading={isProcessing}
                  >
                    Yes, Send me confirmation
                  </LoadingButton>
                </Box>
              </>
            )}

            {phase === 1 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "300px",
                    textAlign: "center",
                  }}
                  component={"form"}
                  onSubmit={handleOtpSubmission}
                >
                  <Typography variant="h5">Enter OTP</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "InactiveCaptionText",
                    }}
                  >
                    Please enter the OTP received in your email to complete the
                    account verification process.
                  </Typography>
                  <MuiOtpInput
                    TextFieldsProps={{
                      type: "text",
                      sx: {
                        textAlign: "center",
                      },
                      disabled: isProcessing || isDisabled || isResending,
                    }}
                    length={5}
                    value={otp}
                    onChange={handleOtpInputChange}
                  />
                  <LoadingButton
                    disabled={isDisabled || isProcessing || isResending}
                    sx={{
                      width: "100%",
                      fontSize: "1rem",
                      textTransform: "none",
                    }}
                    type="submit"
                    variant="contained"
                    loading={isProcessing}
                  >
                    Verify
                  </LoadingButton>
                  <LoadingButton
                    disabled={
                      isDisabled || isResending || isProcessing || !canResend
                    }
                    sx={{
                      width: "100%",
                      fontSize: "1rem",
                      textTransform: "none",
                    }}
                    variant="outlined"
                    loading={isResending}
                    onClick={resendOTP}
                  >
                    Resend
                  </LoadingButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default VerifyEmailClientPage;
