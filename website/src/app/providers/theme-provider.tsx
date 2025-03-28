"use client";

import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { Theme } from "@emotion/react";

export const appTheme: Theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        sx: {
          borderRadius: "100px",
          textTransform: "none",
        },
      },
    },
  },
});

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </>
  );
};
