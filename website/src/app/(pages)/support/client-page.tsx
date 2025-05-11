"use client";

import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface SupportRequestFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SupportClientPage = () => {
  const { user } = useUser();

  const showSnackbar = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [submitSupportFormData, setSubmitSupportFormData] =
    useState<SupportRequestFormData>({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const handleInputChange =
    (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubmitSupportFormData((prev) => ({
        ...prev,
        [f]: e.target.value,
      }));
    };

  const submitSupportRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const name = user ? user.name! : submitSupportFormData.name;
      const email = user ? user.email! : submitSupportFormData.email;
      const subject = submitSupportFormData.subject;
      const message = submitSupportFormData.message;

      if (name.length < 2) {
        showSnackbar("warning", "Name must be at least 2 characters long");
      }

      if (email.length < 5) {
        showSnackbar("warning", "Email seems invalid");
      }

      if (subject.length < 2) {
        showSnackbar("warning", "Subject must be at least 2 characters long");
        return;
      }

      if (message.length < 5) {
        showSnackbar("warning", "Message must be at least 5 characters long");
        return;
      }

      setIsProcessing(true);
      setIsDisabled(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
      });

      if (res.ok) {
        e.currentTarget.reset();
        setIsProcessing(false);
        showSnackbar("success", "Support request submitted successfully");
      } else {
        const data = await res.json();
        setIsProcessing(false);
        setIsDisabled(false);
        showSnackbar("error", data.message || "Something went wrong");
      }
    } catch (E) {
      setIsProcessing(false);
      setIsDisabled(false);
      showSnackbar("error", "Something went wrong");
    }
  };

  return (
    <>
      <Box
        component={"form"}
        onSubmit={submitSupportRequest}
        sx={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "clamp(10rem, 50% , 25rem)",
          "@media screen and (max-width: 600px)": {
            width: "100%",
          },
        }}
      >
        <Typography variant="h5" component={"h1"}>
          Support Forum
        </Typography>

        {!user && (
          <>
            <TextField
              size="small"
              fullWidth
              required
              id="support-name"
              name="name"
              label="Name"
              variant="outlined"
              disabled={isDisabled || isProcessing}
              value={submitSupportFormData.name}
              onChange={handleInputChange("name")}
            />

            <TextField
              size="small"
              fullWidth
              required
              id="support-email"
              name="email"
              label="Email"
              type="email"
              value={submitSupportFormData.email}
              onChange={handleInputChange("email")}
              variant="outlined"
              disabled={isDisabled || isProcessing}
            />
          </>
        )}

        <TextField
          size="small"
          fullWidth
          required
          id="support-subject"
          name="subject"
          label="Subject"
          type="text"
          variant="outlined"
          disabled={isDisabled || isProcessing}
          value={submitSupportFormData.subject}
          onChange={handleInputChange("subject")}
        />

        <TextField
          size="small"
          fullWidth
          required
          id="support-message"
          name="message"
          label="Message"
          multiline
          rows={5}
          variant="outlined"
          disabled={isDisabled || isProcessing}
          value={submitSupportFormData.message}
          onChange={handleInputChange("message")}
        />
        <Box
          sx={{
            "& iframe": {
              borderRadius: "4px",
              width: "301px",
              height: "74px",
              border: "1px solid rgb(57, 56, 62)",
            },
          }}
        >
          <ReCAPTCHA
            theme="dark"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          />
        </Box>
        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isProcessing}
            disabled={isDisabled || isProcessing}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default SupportClientPage;
