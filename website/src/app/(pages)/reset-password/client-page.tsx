"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import lodash from "lodash";
import { useRouter } from "next-nprogress-bar";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUser } from "@/app/providers/UserProvider";
import { useSnackbar } from "@/app/providers/SnackbarProvider";

const { isEqual } = lodash;

const ResetPasswordClientPage = ({
  token,
  email,
}: {
  token: string;
  email: string;
}) => {
  const { user } = useUser();
  const showSnackbar = useSnackbar();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    cPassword: "",
  });

  const togglePassword = () => {
    setShowPassword((x) => !x);
  };
  const handleInputChange =
    (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((x) => ({ ...x, [f]: e.target.value }));
    };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(email)
    e?.preventDefault();
    if (isEqual(formData.cPassword, formData.newPassword)) {
      try {
        setIsProcessing(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/update-password`,
          {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
              email: email,
              token: token,
              password: formData.newPassword,
            }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setIsDisabled(true);
          setIsProcessing(false);
          showSnackbar("success", "Password reset successfully");
          router.push("/");
        } else {
          setIsProcessing(false);
          showSnackbar("error", data.message);
        }
      } catch (e) {
        console.log(e);
        setIsProcessing(false);
        showSnackbar("error", "Something went wrong");
      }
    }
  };
  return (
    <>
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
          <Typography variant="h5" component={"h1"}>
            Reset Password
          </Typography>

          <Box
            id="password-reset-form"
            onSubmit={handleSubmission}
            component={"form"}
            autoComplete="off"
            sx={{
              display: "flex",
              gap: "1rem",
              flexDirection: "column",
            }}
          >
            <Box>
              <TextField
                size="small"
                disabled={isProcessing || isDisabled}
                id="new-password"
                label="Password"
                placeholder="8+ characters"
                required
                fullWidth
                value={formData.newPassword}
                onChange={handleInputChange("newPassword")}
                inputProps={{
                  minLength: 8,
                  maxLength: 250,
                }}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePassword}
                        disabled={isDisabled || isProcessing}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                size="small"
                disabled={isProcessing || isDisabled}
                id="confirm-new-password"
                label="Confirm Password"
                required
                placeholder="re-enter password"
                fullWidth
                value={formData.cPassword}
                onChange={handleInputChange("cPassword")}
                inputProps={{
                  minLength: 8,
                  maxLength: 250,
                }}
                type={showPassword ? "text" : "password"}
              />
            </Box>
            <Box>
              <LoadingButton
                loading={isProcessing}
                disabled={isProcessing || isDisabled}
                color="primary"
                type="submit"
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Box>
          </Box>

          <Typography
            component={"div"}
            sx={{
              color: "InactiveCaptionText",
            }}
          >
            Remembered old password ?{" "}
            <MuiLink component={Link} href="/?action=login">
              Sign in
            </MuiLink>{" "}
          </Typography>
        </Box>
      </>
    </>
  );
};

export default ResetPasswordClientPage;
