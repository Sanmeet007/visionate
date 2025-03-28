"use client";

import { useContext, useState, createContext } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";

interface SnackbarProps {
  opened?: boolean;
  message: string;
  severity: AlertColor;
}

type SnackbarStateUpdaterFunction = {
  (severity?: AlertColor, message?: string): void;
};

const SnackbarContext = createContext<SnackbarStateUpdaterFunction>(() => {});

/**
 * Hook to get the function to show a snackbar
 *
 * @example
 *  export default Component(...) {
 *    const showSnackbar = useSnackbar();
 *
 *    async function onEvent(status) {
 *      ...handlers
 *      // where status can be error , info , success or warning
 *      showSnackbar(status, "message");
 *    }
 *    return (<>...</>)
 *  }
 */
export const useSnackbar = () => {
  return useContext<SnackbarStateUpdaterFunction>(SnackbarContext);
};

/**
 * Provides snackbar
 */
const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarProps>({
    opened: false,
    severity: "error",
    message: "",
  });

  const closeSnackbar = () => {
    setSnackbarState((x) => ({ ...x, opened: false }));
  };

  const showSnackbar = (severity: AlertColor = "success", message = "") => {
    setSnackbarState({ opened: true, severity, message });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarState.opened}
        onClose={closeSnackbar}
        autoHideDuration={2000}
      >
        <Alert onClose={closeSnackbar} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <SnackbarContext.Provider value={showSnackbar}>
        <>{children}</>
      </SnackbarContext.Provider>
    </>
  );
};

export default SnackbarProvider;
