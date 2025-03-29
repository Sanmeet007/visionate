"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "../providers/SnackbarProvider";

type ShowLoginFn = {
  (event: React.MouseEvent<HTMLElement>): void;
};
const SignupForm = ({ showLoginFn }: { showLoginFn: ShowLoginFn }) => {
  const showSnackbar = useSnackbar();

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

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    showSnackbar("info", "Hello wolrd");
  };

  return (
    <>
      <Typography
        variant="h4"
        component={"h1"}
        sx={{
          mb: "2rem",
        }}
      >
        Create account
      </Typography>
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

        <Button type="submit" variant="contained">
          Submit
        </Button>
        <Button variant="outlined" onClick={showLoginFn}>
          Login instead
        </Button>
      </Box>
    </>
  );
};

export default SignupForm;
