"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "../providers/SnackbarProvider";
import { useRouter } from "@bprogress/next/app";
import { useUser } from "../providers/UserProvider";
import { LoadingButton } from "@mui/lab";
import GoogleIcon from "../icons/google-icon";
import TextDivider from "../components/TextDivider";
import Link from "next/link";

type ShowLoginFn = {
  (event: React.MouseEvent<HTMLElement>): void;
};
const SignupForm = () => {
  const { setUser } = useUser();

  const router = useRouter();
  const showSnackbar = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((x) => !x);
  };

  const handleFormDataChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((x) => ({ ...x, [prop]: event.target.value }));
    };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    const userDetails = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    setIsProcessing(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/register`,
        {
          method: "POST",
          body: JSON.stringify({
            ...userDetails,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setIsProcessing(false);
        showSnackbar("success", "Account created successfully");
        setUser(data.user);
        router.push("/sign-up/onboarding");
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message || "Unable to create account");
      }
    } catch (e) {
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
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

  return (
    <>
      <Box
        sx={{
          width: "clamp(10rem, 50% , 25rem)",
          "@media screen and (max-width: 600px)": {
            width: "100%",
          },
        }}
      >
        <Typography
          variant="h5"
          component={"h1"}
          sx={{
            mb: "2rem",
          }}
        >
          Create account
        </Typography>

        <LoadingButton
          startIcon={isGeneratingLink ? null : <GoogleIcon />}
          onClick={(e) => loginUsingGoogle(e)}
          disabled={isGeneratingLink || isProcessing}
          loading={isGeneratingLink}
          variant="outlined"
          fullWidth
          sx={{
            textTransform: "none",
            borderRadius: "100px",
            fontSize: "1rem",
          }}
        >
          Sign up with Google
        </LoadingButton>

        <TextDivider my="1rem" text={"or sign up with email"} />

        <Box
          component={"form"}
          onSubmit={handleFormSubmission}
          autoComplete="off"
          method="POST"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <TextField
            disabled={isProcessing || isDisabled}
            required
            size="small"
            name="email_id"
            id="email-id"
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleFormDataChange("name")}
            placeholder="Enter your name"
            fullWidth
          />
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
            type="submit"
            variant="contained"
            loading={isProcessing || isDisabled}
          >
            Submit
          </LoadingButton>
          <Typography variant="body1">
            Already a user ?{" "}
            <MuiLink component={Link} href="/?action=login">
              Login instead
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SignupForm;
