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
