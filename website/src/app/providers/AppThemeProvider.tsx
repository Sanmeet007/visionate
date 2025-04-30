"use client";

import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  createTheme,
  Theme,
} from "@mui/material";
import React from "react";

/**
 * App theme configuration object created
 */
export const appTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#070025",
      paper: "#110b27",
    },
    primary: {
      main: "#ded3ff",
      contrastText: "rgba(0,0,0,0.9)",
    },
    secondary: {
      main: "#FF3A61",
      contrastText: "rgba(255,255,255,0.9)",
    },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#110b27",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        disableElevation: true,
        root: {
          borderRadius: "100px",
          textTransform: "none",
        },
      },
    },
  },
});

/**
 * Custom app theme provider that extends MUI theme
 */
const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </>
  );
};

export default AppThemeProvider;
