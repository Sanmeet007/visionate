"use client";

import Flexbox from "@/app/components/Flexbox";
import { useLoader } from "@/app/providers/GlobalLoader";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import {
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";

import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

interface FormData {
  name: string;
}

const MyAccountClientPage = () => {
  const { showLoader, hideLoader } = useLoader();
  const showSnackbar = useSnackbar();

  const { user, setUser } = useUser();
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState(
    user?.profileImage ?? null
  );
  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? "",
  });

  const handleFieldChange =
    (fieldname: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((x) => ({ ...x, [fieldname]: e.target.value }));
    };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileImageURL(null);

    const files = e.target.files;
    if (files) {
      const image = files[0];
      if (image) {
        const blobURL = URL.createObjectURL(image);
        setProfileImageURL(blobURL);
      }
    }
  };

  const removeUserProfileImage = () => {
    setProfileImageURL(null);
    if (profileImageRef.current) {
      profileImageRef.current.value = "";
    }
  };

  const resetProfileImage = () => {
    setProfileImageURL(user?.profileImage ?? null);
    if (profileImageRef.current) {
      profileImageRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let shouldUpdateProfileImage = false;
    let shouldUpdateName = false;

    if (formData.name.length < 3) {
      showSnackbar("warning", "Name must be at least 3 characters long");
      return;
    }
    if (formData.name.length >= 100) {
      showSnackbar("warning", "Name must be less than 100 characters long");
      return;
    }

    if (profileImageURL !== (user?.profileImage ?? null)) {
      shouldUpdateProfileImage = true;
    }

    if (formData.name.length > 3 && formData.name !== user?.name) {
      shouldUpdateName = true;
    }

    if (!shouldUpdateProfileImage && !shouldUpdateName) {
      showSnackbar("info", "No changes detected");
      return;
    }

    try {
      setIsUpdating(true);
      showLoader();

      if (shouldUpdateProfileImage) {
        const formDataToSend = new FormData();

        if (profileImageURL === null) {
          formDataToSend.append("remove-profile-image", "Y");
        } else {
          formDataToSend.append("remove-profile-image", "N");
          formDataToSend.append("image", profileImageRef.current!.files![0]);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active/update-profile-image`,
          {
            method: "POST",
            body: formDataToSend,
          }
        );

        if (!res.ok) {
          setIsUpdating(false);
          hideLoader();
          showSnackbar("error", "Unable to update profile image");
          return;
        } else {
          const data = await res.json();
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              profileImage: data.profileImageURL,
            };
          });
        }
      }

      if (shouldUpdateName) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
            }),
          }
        );

        if (!res.ok) {
          setIsUpdating(false);
          hideLoader();
          showSnackbar("error", "Unable to update name");
          return;
        } else {
          // const data = await res.json();

          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              name: formData.name,
            };
          });
        }
      }

      setIsUpdating(false);
      hideLoader();
      showSnackbar("success", "Profile updated successfully");
    } catch (error) {
      setIsUpdating(false);
      hideLoader();
      showSnackbar("error", "Profile update failed");
    }
  };

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
          <Box component={"form"} onSubmit={handleFormSubmit}>
            <Flexbox
              sx={{
                alignItems: "center",
                gap: "1rem",
                my: "1rem",
              }}
            >
              <Box>
                <Avatar
                  src={profileImageURL ?? ""}
                  alt={"S"}
                  sx={{
                    height: "100px",
                    width: "100px",
                    fontSize: "2rem",
                  }}
                >
                  {user?.name?.slice(0, 1).toUpperCase() ?? ""}
                </Avatar>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  ref={profileImageRef}
                  disabled={isUpdating}
                  type="file"
                  name="profile-image-upload"
                  id="profile-image-upload"
                  hidden
                  accept=".jpg,.png"
                  onChange={handleProfileImageChange}
                />
                <Button
                  component="label"
                  htmlFor="profile-image-upload"
                  disabled={isUpdating}
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Change Photo
                </Button>
                <Flexbox
                  sx={{
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    disabled={isUpdating}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteForeverIcon />}
                    onClick={removeUserProfileImage}
                  >
                    Remove
                  </Button>
                  <Button
                    disabled={isUpdating}
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<RestoreIcon />}
                    onClick={resetProfileImage}
                  >
                    Reset
                  </Button>
                </Flexbox>
              </Box>
            </Flexbox>

            <Box
              sx={{
                my: "1rem",
                display: "flex",
                gap: "1rem",
                flexDirection: "column",
              }}
            >
              <TextField
                disabled={isUpdating}
                required
                label="Name"
                size="small"
                placeholder={"Enter your name"}
                sx={{ maxWidth: "400px" }}
                value={formData.name}
                onChange={handleFieldChange("name")}
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
            <Button type="submit" variant="outlined">
              Save
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
