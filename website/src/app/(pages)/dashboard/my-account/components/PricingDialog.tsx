"use client";

import PricingTiers from "@/app/(pages)/sign-up/onboarding/components/PricingCard";
import { usersTable } from "@/drizzle/schema";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useLoader } from "@/app/providers/GlobalLoader";
import { useUser } from "@/app/providers/UserProvider";

type PricingTier = typeof usersTable.$inferSelect.subscriptionType;

const PricingDialog = ({
  open,
  closeDialog,
  currentTier,
  handleUpgrade: handleUpgradeProp,
}: {
  currentTier: PricingTier;
  open: boolean;
  closeDialog: () => void;
  handleUpgrade: (tier: PricingTier) => void;
}) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(currentTier);

  const handleSelectChange = (value: PricingTier) => {
    setSelectedTier(value);
  };

  const handleUpgrade = () => {
    handleUpgradeProp(selectedTier);
  };

  return (
    <>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Choose a pricing tier</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
              mt: "1rem",
            }}
          >
            <PricingTiers
              selectedTier={selectedTier}
              onSelectChange={handleSelectChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            disabled={currentTier === selectedTier}
            onClick={handleUpgrade}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PricingDialog;
