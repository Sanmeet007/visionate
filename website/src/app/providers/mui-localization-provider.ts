import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import React from "react";


export const MuiLocalizationProvider = ({ children }:{ children: React.ReactNode}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {children}
    </LocalizationProvider>
  );
};
