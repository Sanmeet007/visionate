"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "../providers/SnackbarProvider";
import ReCAPTCHA from "react-google-recaptcha";
import { LoadingButton } from "@mui/lab";
import { useUser } from "../providers/UserProvider";

type ShowSignUpFn = {
  (event: React.MouseEvent<HTMLElement>): void;
};

const LoginForm = ({ showSignUpFn }: { showSignUpFn: ShowSignUpFn }) => {
  const showSnackbar = useSnackbar();
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

  // function onChange(value) {
  //   console.log("Captcha value:", value);
  // }

  // const recaptchaRef = React.createRef();

  return (
    <>
      <Typography
        variant="h4"
        component={"h1"}
        sx={{
          mb: "2rem",
        }}
      >
        Login to your account
      </Typography>
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
        {/* <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.RECAPTCHA_KEY || ""}
          onChange={onChange}
        /> */}
        <TextField
          disabled={isProcessing || isDisabled}
          required
          size="small"
          name="email_id"
          id="email-id"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleFormDataChange("email")}
          placeholder="Enter a valid email address"
          fullWidth
        />
        <TextField
          disabled={isProcessing || isDisabled}
          required
          size="small"
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
          placeholder="Enter a secure password here"
          fullWidth
        />
        <LoadingButton
          disableElevation
          loading={isProcessing}
          type="submit"
          variant="contained"
        >
          Submit
        </LoadingButton>
        <Button
          disabled={isProcessing || isDisabled}
          variant="outlined"
          onClick={showSignUpFn}
        >
          Sign up instead
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
