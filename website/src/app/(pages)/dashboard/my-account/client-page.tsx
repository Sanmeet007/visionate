"use client";

import Flexbox from "@/app/components/Flexbox";
import { useLoader } from "@/app/providers/GlobalLoader";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import {
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import PricingDialog from "./components/PricingDialog";
import Script from "next/script";
import { usersTable } from "@/drizzle/schema";
import subscriptionPricing from "@/utils/sub-pricing";

interface FormData {
  name: string;
}

type PricingTier = typeof usersTable.$inferSelect.subscriptionType;

const MyAccountClientPage = () => {
  const { showLoader, hideLoader } = useLoader();
  const showSnackbar = useSnackbar();
  const confirmDeletion = useConfirm();

  const { user, setUser } = useUser();
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
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

  const [isSendingResetPasswordLink, setIsSendingResetPasswordLink] =
    useState(false);

  const handleSendResetPasswordLink = async () => {
    try {
      setIsSendingResetPasswordLink(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/token/generate?type=password&email=${user?.email}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setIsSendingResetPasswordLink(false);
        showSnackbar(
          "error",
          data.message || "Unable to send reset password link"
        );
        return;
      }

      setIsSendingResetPasswordLink(false);
      showSnackbar("success", "Reset password link sent successfully");
    } catch (error) {
      setIsSendingResetPasswordLink(false);
      showSnackbar("error", "Unable to send reset password link");
    }
  };

  const handleAccountDelete = async () => {
    try {
      const { confirmed } = await confirmDeletion({
        title: "Are you sure?",
        description:
          "Please be aware that deleting your account is permanent and irreversible. All active subscriptions will be immediately canceled and all associated data will be permanently removed.",
        confirmationText: "Delete",
      });

      if (!confirmed) return;

      setAreButtonsDisabled(true);
      showLoader();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        hideLoader();
        showSnackbar("error", "Unable to delete account");
        return;
      }

      window.location.reload();
    } catch (error) {
      setAreButtonsDisabled(false);
      hideLoader();
      showSnackbar("error", "Unable to delete account");
    }
  };

  const [showPlans, setShowPlans] = useState(false);

  const handleViewPlan = () => {
    setShowPlans(true);
  };

  const handleClosePlansDialog = () => {
    setShowPlans(false);
  };

  const createOrderId = async (
    subscriptionType: string,
    currency: string = "INR"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ORIGIN}/api/payments/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionType,
            currency,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleUpgrade = async (selectedTier: PricingTier) => {
    try {
      let shouldAskPayment = true;
      handleClosePlansDialog();
      showLoader();

      if (selectedTier === "free") {
        shouldAskPayment = false;
      }

      if (shouldAskPayment) {
        const amount = subscriptionPricing[selectedTier].price * 100; // in paise
        const orderId: string = await createOrderId(selectedTier);
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: "INR",
          name: user!.name,
          readonly: { email: true },
          prefill: { email: user!.email },
          description: "description",
          order_id: orderId,
          modal: {
            ondismiss: function () {
              hideLoader();
            },
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            const data = {
              orderCreationId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const paymentResponse = await fetch(
              `${process.env.NEXT_PUBLIC_ORIGIN}/api/payments/verify`,
              {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              }
            );
            const paymentResponseData = await paymentResponse.json();

            if (paymentResponseData.isOk) {
              hideLoader();
              setUser((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  subscriptionType:
                    selectedTier as typeof usersTable.$inferSelect.subscriptionType,
                  onboardingCompleted: new Date(),
                };
              });
              showSnackbar("success", "Woohoo! Payment successful");
            } else {
              hideLoader();
              showSnackbar(
                "error",
                paymentResponseData?.message || "Ah! Error processing payment"
              );
            }
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          hideLoader();
          showSnackbar(
            "error",
            response?.error?.description || "Ah! Error processing payment"
          );
        });

        paymentObject.open();
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/active/complete-onboarding`
        );

        if (res.ok) {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              subscriptionType:
                selectedTier as typeof usersTable.$inferSelect.subscriptionType,
              onboardingCompleted: new Date(),
            };
          });
        } else {
          hideLoader();
          showSnackbar("error", "Ah! Something went wrong");
        }
      }
    } catch (e) {
      if (Number(process.env.LOGGING_LEVEL) > 0) {
        console.error(e);
      }

      hideLoader();
      showSnackbar("error", "Something went wrong");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-update-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {showPlans && (
        <>
          <PricingDialog
            open={showPlans}
            closeDialog={handleClosePlansDialog}
            currentTier={user?.subscriptionType ?? "free"}
            handleUpgrade={handleUpgrade}
          />
        </>
      )}
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
            <Button variant="outlined" color="primary" onClick={handleViewPlan}>
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
            <LoadingButton
              loading={isSendingResetPasswordLink}
              disabled={isSendingResetPasswordLink}
              variant="contained"
              color="secondary"
              onClick={handleSendResetPasswordLink}
            >
              Reset Password
            </LoadingButton>
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
            <Button
              variant="contained"
              color="error"
              disabled={areButtonsDisabled}
              onClick={handleAccountDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MyAccountClientPage;
