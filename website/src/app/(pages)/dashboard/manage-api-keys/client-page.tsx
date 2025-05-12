"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import { LoadingButton } from "@mui/lab";
import { useConfirm } from "material-ui-confirm";

interface ApiKey {
  id: string;
  keyName: string;
  apiKey: string;
  createdAt: string;
  isActive: boolean;
}

const fetchApiKeys = async (): Promise<{ keys: ApiKey[] }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/keys`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || response.statusText);
  }
  return await response.json();
};

const generateApiKey = async (keyName: string): Promise<ApiKey> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyName }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || response.statusText);
  }
  return response.json();
};

const revokeApiKey = async (key: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/keys/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey: key }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || response.statusText);
  }
};

interface ModalState {
  opened: boolean;
}

const ApiKeyManagement = () => {
  const confirmDeletion = useConfirm();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const [modalState, setModalState] = useState<ModalState>({
    opened: false,
  });

  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [displayKey, setDisplayKey] = useState("");

  const { user } = useUser();
  const showSnackbar = useSnackbar();
  const [newKeyName, setNewKeyName] = useState("");
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({});

  const {
    data: apiKeysData,
    isLoading: isFetchingKeys,
    isError,
    error,
  } = useQuery({
    queryKey: ["apiKeys", user!.id, queryParams],
    queryFn: async () => {
      return await fetchApiKeys();
    },
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const { mutate: generateKeyMutation, isPending: isGenerating } = useMutation({
    mutationFn: generateApiKey,
    onSuccess: () => {
      showSnackbar("success", "API key generated successfully!");
      setNewKeyName("");
      queryClient.invalidateQueries({
        queryKey: ["apiKeys", user?.id, queryParams],
      });
    },
    onError: (err: any) => {
      showSnackbar(
        "error",
        `${err?.message || "An unexpected error occurred"}`
      );
    },
  });

  const { mutate: revokeKeyMutation, isPending: isRevoking } = useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      showSnackbar("success", "API key revoked successfully!");
      queryClient.invalidateQueries({
        queryKey: ["apiKeys", user?.id, queryParams],
      });
    },
    onError: (err: any) => {
      showSnackbar(
        "error",
        `Failed to revoke API key: ${
          err?.message || "An unexpected error occurred"
        }`
      );
    },
  });

  const handleGenerateApiKey = () => {
    closeModal();
    if (!newKeyName.trim()) {
      showSnackbar("error", "Please enter a name for your new API key.");
      return;
    }
    generateKeyMutation(newKeyName);
  };

  const handleRevokeApiKey = async (keyId: string) => {
    const { confirmed } = await confirmDeletion({
      title: "Confirm API Key Revocation",
      description:
        "Are you sure you want to revoke this API key? This action cannot be undone.",
    });

    if (confirmed) {
      revokeKeyMutation(keyId);
    }
  };

  const handleCopyApiKey = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    showSnackbar("success", "API key copied to clipboard!");
  };

  const closeModal = () => {
    setModalState({
      opened: false,
    });
    setTimeout(() => {
      setNewKeyName("");
    }, 50);
  };
  const openModal = () => {
    setModalState({ opened: true });
  };

  const closeApiKeyModal = () => {
    setApiKeyModal(false);
  };

  const showApiKey = (keyValue: string) => {
    setDisplayKey(keyValue);
    setApiKeyModal(true);
  };

  if (isError) {
    return (
      <>
        <Typography color="error">
          Error fetching API keys: {error?.message}
        </Typography>
      </>
    );
  }

  return (
    <>
      {apiKeyModal && (
        <Dialog open={apiKeyModal} onClose={closeApiKeyModal}>
          <DialogTitle>API Key</DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                p: "1rem",
                borderRadius: "10px",
                fontStyle: "italic",
              }}
            >
              {displayKey}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                handleCopyApiKey(displayKey);
                closeApiKeyModal();
              }}
              color="primary"
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              onClick={closeApiKeyModal}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={modalState.opened} onClose={closeModal}>
        <DialogTitle>Generate new key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a unique and descriptive name for your new API key.
            This will help you easily identify and manage it in the future.
          </DialogContentText>
          <Box sx={{ mt: "1rem" }}>
            <TextField
              required
              fullWidth
              label="Key Name"
              variant="outlined"
              size="small"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter a name for your key"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeModal} color="primary">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleGenerateApiKey}
            disabled={newKeyName.length < 3 || isGenerating}
            loading={isGenerating}
          >
            Generate
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          p: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "1rem",
          }}
        >
          <Typography variant="h6" component={"h1"}>
            Manange api keys
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={openModal}
              sx={{
                minWidth: "auto",
                width: "3rem",
                height: "3rem",
              }}
            >
              <AddIcon fontSize="medium" />
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "rgb(17 11 39 / 70%)",
            }}
          >
            <Table aria-label="api key table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>API Key</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                {apiKeysData?.keys?.map((key, i) => (
                  <TableRow key={key.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{key.keyName}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{
                            wordBreak: "break-all",
                            flexGrow: 1,
                            minWidth: "2rem",
                          }}
                        >
                          {isSmallDevice && typeof key.apiKey === "string"
                            ? "*****"
                            : "************"}
                        </Typography>
                        <IconButton
                          onClick={() => handleCopyApiKey(key.apiKey)}
                          aria-label="copy"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(key.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="delete key">
                        <IconButton
                          onClick={() => handleRevokeApiKey(key.apiKey)}
                          aria-label="delete"
                          color="error"
                          disabled={isRevoking}
                        >
                          {isRevoking ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="show key">
                        <IconButton
                          onClick={() => showApiKey(key.apiKey)}
                          aria-label="show"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isFetchingKeys && (
              <>
                <Box
                  sx={{
                    m: "1rem",
                    display: "grid",
                    gap: "0.5rem",
                  }}
                >
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        key={`skeleton-row-${i}`}
                        width="100%"
                        variant="rounded"
                        animation="wave"
                        height={"50px"}
                      />
                    ))}
                </Box>
              </>
            )}
            {!isFetchingKeys && apiKeysData?.keys.length === 0 && (
              <>
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100px",
                  }}
                >
                  Nothing to display
                </Box>
              </>
            )}
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ApiKeyManagement;
