"use client";

import { useUser } from "@/app/providers/UserProvider";
import { Box, Button, TextField, Typography } from "@mui/material";

const MyAccountClientPage = () => {
  const { user } = useUser();
  return (
    <>
      <Box sx={{ p: "1rem" }}>
        <Box>
          <Typography variant="h6" component={"h1"}>
            Manage your account
          </Typography>
        </Box>
        <Box
          sx={{
            my: "1rem",
            bgcolor: "rgb(17 11 39 / 70%)",
            p: "1rem",
            borderRadius: "20px",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="subtitle2" color="InactiveCaptionText">
            Provide your information so that your account can operate correctly
          </Typography>
          <Box>
            <Box
              sx={{
                my: "1rem",
                display: "flex",
                gap: "1rem",
                flexDirection: "column",
              }}
            >
              <TextField
                required
                label="Name"
                size="small"
                placeholder={"Enter your name"}
                sx={{ maxWidth: "400px" }}
              />
              <TextField
                required
                label="Email address"
                size="small"
                disabled
                value={user?.email ?? ""}
                sx={{ maxWidth: "400px" }}
              />
            </Box>
            <Button variant="outlined">Save</Button>
          </Box>
        </Box>
        <Box
          sx={{
            my: "1rem",
            bgcolor: "rgb(17 11 39 / 70%)",
            p: "1rem",
            borderRadius: "20px",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Subscription
          </Typography>
          <Typography variant="subtitle2" color="InactiveCaptionText">
            Review available plans and select your preferred option.
          </Typography>
          <Box
            sx={{
              mt: "1rem",
              display: "flex",
              gap: "1rem",
            }}
          >
            <Button variant="outlined" color="primary">
              View Plans
            </Button>
            <Button variant="contained" color="primary">
              Upgrade
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            my: "1rem",
            bgcolor: "rgb(17 11 39 / 70%)",
            p: "1rem",
            borderRadius: "20px",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Password
          </Typography>
          <Typography variant="subtitle2" color="InactiveCaptionText">
            Set a password that is unique
          </Typography>
          <Box
            sx={{
              mt: "1rem",
            }}
          >
            <Button variant="contained" color="secondary">
              Reset Password
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            my: "1rem",
            bgcolor: "rgb(17 11 39 / 70%)",
            p: "1rem",
            borderRadius: "20px",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Delete your account
          </Typography>
          <Typography variant="subtitle2" color="InactiveCaptionText">
            Permanently remove your profile and associated information.
          </Typography>
          <Box
            sx={{
              mt: "1rem",
            }}
          >
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MyAccountClientPage;
