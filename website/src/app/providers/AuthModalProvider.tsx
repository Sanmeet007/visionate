"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import Grow from "@mui/material/Grow";
import { SnackbarProps } from "./SnackbarProvider";
import { TransitionProps } from "@mui/material/transitions";
import LoginForm from "../fragments/LoginForm";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function Transition(props, ref) {
    return (
      <Grow
        style={{ transformOrigin: "center" }}
        easing="ease-in"
        className={props.in ? "fade fade-in" : "fade"}
        ref={ref}
        {...props}
      >
        {props.children as React.ReactElement}
      </Grow>
    );
  }
);

interface AuthModalState {
  opened: boolean;
  message: string;
  signup: boolean;
}

interface ModalFunctions {
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
}

const AuthModalFns = createContext<ModalFunctions | null>(null);

const AuthModalStateUpdater = createContext<React.Dispatch<
  React.SetStateAction<AuthModalState>
> | null>(null);

export const useAuthModalFns = () => {
  return useContext(AuthModalFns);
};

export const useAuthModalStateUpdater = () => {
  return useContext(AuthModalStateUpdater);
};

const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [canClose, setCanClose] = useState(true);

  const [snackbarState, setSnackbarState] = useState<SnackbarProps>({
    severity: "error",
    opened: false,
    message: "",
  });

  const closeSnackbar = () => {
    setSnackbarState((x) => ({
      ...x,
      opened: false,
    }));
  };

  const showSnackbar = (severity: AlertColor, message: string) => {
    setSnackbarState((x) => ({ severity, message, opened: true }));
  };

  const [state, setState] = useState<AuthModalState>({
    opened: false,
    message: "",
    signup: false,
  });

  const closeModal = () => {
    if (canClose) {
      setState((x) => ({ ...x, opened: false }));
    }

    const action = searchParams.get("action");
    if (action === "login") {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("action");
      router.push(`/?${newSearchParams.toString()}`);
    }
  };

  const openModal = (message: string = "") => {
    setState((x) => ({ ...x, message, opened: true }));
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get("action");
    setState((x) => ({ ...x, opened: pathname === "/" && action === "login" }));
  }, [pathname, searchParams]);

  return (
    <>
      <Snackbar
        open={snackbarState.opened}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbarState.severity ?? "info"}
          sx={{ width: "100%" }}
          onClose={closeSnackbar}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>

      <AuthModalStateUpdater.Provider value={setState}>
        <AuthModalFns.Provider
          value={{ openAuthModal: openModal, closeAuthModal: closeModal }}
        >
          <Dialog
            keepMounted
            open={state.opened}
            onClose={closeModal}
            TransitionComponent={Transition}
          >
            <DialogTitle id={"login-modal"}>
              <Typography variant="h6" component={"span"}>
                Login to your account
              </Typography>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
            <DialogContent
              dividers
              sx={{
                "@media screen and (min-width:1000px)": {
                  minWidth: "400px",
                },
              }}
            >
              {state.message && (
                <DialogContentText sx={{ mb: "1rem" }}>
                  {state.message}
                </DialogContentText>
              )}

              <LoginForm showSnackbar={showSnackbar} />

              <Typography
                component={"div"}
                sx={{
                  mt: "1.5rem",
                  color: "InactiveCaptionText",
                }}
              >
                {"Don't"} have an account?{" "}
                <MuiLink component={Link} href="/sign-up">
                  Sign up
                </MuiLink>
              </Typography>
            </DialogContent>
          </Dialog>
          {children}
        </AuthModalFns.Provider>
      </AuthModalStateUpdater.Provider>
    </>
  );
};

export default AuthModalProvider;
