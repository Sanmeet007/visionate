"use client";

import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import React, { useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import EmailBgGraphpic from "./EmailBg";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";

import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { MuiOtpInput } from "mui-one-time-password-input";

import {
  useEmailModalContext,
  useEmailModalContextUpdater,
} from "../providers/EmailVerficationModalProvider";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Grow
      style={{
        transformOrigin: "center",
      }}
      easing={"ease-in"}
      className={props.in ? "fade fade-in" : "fade"}
      ref={ref}
      {...props}
    ></Grow>
  );
});

const EmailVerificationModal = () => {
  const [hasFiledPeace, setHasFiledPeace] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);

  const user = useUserContext();
  const updateUserContext = useUserUpdaterContext();
  const showSnackbar = useSnackbar();
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [phase, setPhase] = useState(0);

  const showEmailModal = useEmailModalContext();
  const setShowEmailModal = useEmailModalContextUpdater();

  const handleOtpInputChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOnClose = () => {};

  const resendOTP = async (e) => {
    e?.preventDefault();

    try {
      setIsResending(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_HOST}/api/auth/otp/generate?type=email`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsResending(false);
        setIsDisabled(false);
        setCanResend(false);

        showSnackbar("success", "OTP re-sent successfully");
      } else {
        setIsResending(false);
        setIsDisabled(false);

        showSnackbar("error", data.message || "Unable to send otp");
      }
    } catch (e) {
      console.log(e);
      setIsResending(false);
      setIsDisabled(false);

      showSnackbar("error", "Something went wrong");
    }
  };

  const handleOtpSubmission = async (e) => {
    e?.preventDefault();

    if (otp.length === 5) {
      if (otp.split().every((x) => !Number.isNaN(parseInt(x)))) {
        // Silence is golden
      } else {
        showSnackbar("warning", "Please enter a valid otp");
        return;
      }
    } else {
      showSnackbar("warning", "Please enter a valid otp");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_HOST}/api/auth/otp/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            type: "email",
            otp,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setShowEmailModal(false);
        setIsProcessing(false);
        showSnackbar("success", "Account verified succesfully");
        updateUserContext((x) => ({ ...x, verified: true }));
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message || "Invalid otp");
      }
    } catch (e) {
      console.log(e);
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  const handleSendConfimation = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_HOST}/api/auth/otp/generate?type=email`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsProcessing(false);
        showSnackbar("success", "Confirmation sent successfully");
        setPhase(1);
      } else {
        setIsProcessing(false);
        showSnackbar("error", data.message || "Unable to send confirmation");
      }
    } catch (e) {
      console.log(e);
      setIsProcessing(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  const handleRemindLaterClick = () => {
    setShowEmailModal(false);
    setHasFiledPeace(true);
  };

  return (
    <>
      {user && (
        <Dialog
          TransitionComponent={Transition}
          open={Boolean(showEmailModal && !hasFiledPeace)}
          onClose={handleOnClose}
          aria-labelledby={"email verification modal"}
        >
          <DialogTitle id={"email-verfication-modal"}></DialogTitle>
          <DialogContent>
            <DialogContentText component={"div"}>
              <ColorPaletteProvider>
                {phase === 0 && (
                  <>
                    <Box
                      sx={{
                        //   textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "1rem",
                        maxWidth: "300px",
                        textAlign: "center",
                      }}
                    >
                      <EmailBgGraphpic />
                      <Typography variant="h5">
                        We still need to confirm your email
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "InactiveCaptionText",
                        }}
                      >
                        should we send confirmation to{" "}
                        <Box
                          component={"span"}
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {user.email}
                        </Box>{" "}
                        ?
                      </Typography>
                      <LoadingButton
                        disabled={isDisabled || isProcessing}
                        sx={{
                          textTransform: "none",
                          width: "100%",
                          fontSize: "1rem",
                        }}
                        onClick={handleSendConfimation}
                        variant="contained"
                        loading={isProcessing}
                      >
                        Yes, Send me confirmation
                      </LoadingButton>
                      <Typography
                        onClick={handleRemindLaterClick}
                        component={"span"}
                        sx={{
                          color: (theme) =>
                            isProcessing || isDisabled
                              ? theme.palette.grey
                              : theme.palette.primary.main,
                          textDecoration: "underline",

                          cursor:
                            isProcessing || isDisabled
                              ? "not-allowed"
                              : "pointer",
                          "&:hover": {
                            color: (theme) =>
                              isProcessing || isDisabled
                                ? theme.palette.grey
                                : "inherit",
                          },
                        }}
                      >
                        Remind me later
                      </Typography>
                    </Box>
                  </>
                )}

                {phase === 1 && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "1rem",
                        width: "300px",
                        textAlign: "center",
                      }}
                      component={"form"}
                      onSubmit={handleOtpSubmission}
                    >
                      <Typography variant="h5">Enter OTP</Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "InactiveCaptionText",
                        }}
                      >
                        Please enter the OTP received in your email to complete
                        the account verification process.
                      </Typography>
                      <MuiOtpInput
                        TextFieldsProps={{
                          disabled: isProcessing || isDisabled || isResending,
                          size: "small",
                        }}
                        length={5}
                        value={otp}
                        onChange={handleOtpInputChange}
                      />
                      <LoadingButton
                        disabled={isDisabled || isProcessing || isResending}
                        sx={{
                          width: "100%",
                          fontSize: "1rem",
                          textTransform: "none",
                        }}
                        type="submit"
                        variant="contained"
                        loading={isProcessing}
                      >
                        Verify
                      </LoadingButton>
                      <LoadingButton
                        disabled={
                          isDisabled ||
                          isResending ||
                          isProcessing ||
                          !canResend
                        }
                        sx={{
                          width: "100%",
                          fontSize: "1rem",
                          textTransform: "none",
                        }}
                        variant="outlined"
                        loading={isResending}
                        onClick={resendOTP}
                      >
                        Resend
                      </LoadingButton>
                    </Box>
                  </>
                )}
              </ColorPaletteProvider>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EmailVerificationModal;
