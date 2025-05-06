"use client";

import {
  AlertColor,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleIcon from "@/app/icons/google-icon";
import { LoadingButton } from "@mui/lab";
import { useUser } from "@/app/providers/UserProvider";
import Link from "next/link";
import TextDivider from "../components/TextDivider";

type ShowSnackbarFn = (severity: AlertColor, message: string) => void;

const LoginForm = ({ showSnackbar }: { showSnackbar: ShowSnackbarFn }) => {
  const { setUser } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toggleShowPassword = () => {
    setShowPassword((x) => !x);
  };

  const handleFormDataChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((x) => ({ ...x, [prop]: event.target.value }));
    };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        showSnackbar("success", "Login success");
        setUser(data.user);
      } else {
        showSnackbar("error", data?.message || "Something went wrong");
        setIsDisabled(false);
      }
    } catch (e) {
      showSnackbar("error", "Something went wrong");
      setIsDisabled(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const loginUsingGoogle = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setIsGeneratingLink(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/oauth/geturl`,
        {
          credentials: "include",
        }
      );
      if (typeof window !== "undefined") {
        if (res.ok) {
          const data = await res.json();
          window.location.href = data.url;
          setIsGeneratingLink(false);
        } else {
          throw Error("Unable to generate link");
        }
      }
    } catch (e) {
      setIsGeneratingLink(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  // function onChange(value) {
  //   console.log("Captcha value:", value);
  // }

  // const recaptchaRef = React.createRef();

  return (
    <>
      <Box
        component={"form"}
        onSubmit={handleFormSubmission}
        autoComplete="on"
        method="POST"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {" "}
        <LoadingButton
          startIcon={isGeneratingLink ? null : <GoogleIcon />}
          onClick={(e) => loginUsingGoogle(e)}
          disabled={isGeneratingLink || isProcessing}
          loading={isGeneratingLink}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "100px",
            fontSize: "1rem",
          }}
        >
          Sign in with Google
        </LoadingButton>
        <TextDivider my="0" text={"or sign in with email"} />
        <TextField
          size="small"
          disabled={isProcessing || isDisabled}
          required
          name="email_id"
          id="email-id"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleFormDataChange("email")}
          placeholder="Enter a valid email address"
          autoComplete="email"
          fullWidth
        />
        <TextField
          size="small"
          disabled={isProcessing || isDisabled || isGeneratingLink}
          required
          name="password"
          id="passsword"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={formData.password}
          onChange={handleFormDataChange("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
          placeholder="Enter a secure password here"
          fullWidth
        />
        {/* <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.RECAPTCHA_KEY || ""}
          onChange={onChange}
        /> */}
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <Box></Box>
          <MuiLink
            fontSize={"small"}
            component={Link}
            href="/forgot-password"
            // onClick={closeModal}
          >
            Forgot password ?
          </MuiLink>
        </Box>
        <LoadingButton
          disabled={isGeneratingLink || isProcessing || isGeneratingLink}
          disableElevation
          loading={isProcessing}
          type="submit"
          variant="contained"
        >
          Submit
        </LoadingButton>
      </Box>
    </>
  );
};

export default LoginForm;
