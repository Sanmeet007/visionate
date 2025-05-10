"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useSnackbar } from "@/app/providers/SnackbarProvider";

const ForgotPasswordClientPage = () => {
  const showSnackbar = useSnackbar();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/token/generate?type=password&email=${email}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setIsDisabled(true);
        setIsProcessing(false);
        showSnackbar(
          "success",
          "Instructions to reset your password will be sent to you. Please check your email."
        );
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message);
      }
    } catch (E) {
      console.log(E);
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
      return;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          flexDirection: "column",
          width: "clamp(10rem, 50% , 25rem)",

          "@media screen and (max-width: 600px)": {
            width: "100%",
          },
        }}
      >
        <Typography
          sx={{
            mb: "1rem",
          }}
          variant="h5"
          component={"h1"}
        >
          Forgot password ?
        </Typography>

        <Typography
          sx={{
            color: "InactiveCaptionText",
          }}
        >
          Enter the email address you used when you joined and {"we'll"} send
          you instructions to reset your password.
        </Typography>

        <Typography
          sx={{
            color: "InactiveCaptionText",
          }}
        >
          For security reasons, your password is securely stored and encrypted.{" "}
          Rest assured that we will never send your password via email.
        </Typography>

        <Box component={"form"} autoComplete="off" onSubmit={handleSubmission}>
          <Box sx={{ mb: "1.5rem" }}>
            <TextField
              size="small"
              type="email"
              disabled={isProcessing || isDisabled}
              label="Email Address"
              fullWidth
              required
              value={email}
              onChange={handleEmailChange}
            />
          </Box>

          <LoadingButton
            variant="contained"
            color="primary"
            disabled={isProcessing || isDisabled}
            loading={isProcessing}
            type="submit"
          >
            Send Reset Instructions
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordClientPage;
