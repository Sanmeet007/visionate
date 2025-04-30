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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";

interface ApiKey {
  id: string;
  keyName: string;
  apiKey: string;
  createdAt: string;
  isActive: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

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

const ApiKeyManagement = () => {
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
        `Failed to generate API key: ${
          err?.message || "An unexpected error occurred"
        }`
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
    if (!newKeyName.trim()) {
      showSnackbar("error", "Please enter a name for your new API key.");
      return;
    }
    generateKeyMutation(newKeyName);
  };

  const handleRevokeApiKey = (keyId: string) => {
    if (
      window.confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      revokeKeyMutation(keyId);
    }
  };

  const handleCopyApiKey = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    showSnackbar("success", "API key copied to clipboard!");
  };

  if (isFetchingKeys) {
    return (
      <StyledPaper>
        <CircularProgress />
      </StyledPaper>
    );
  }

  if (isError) {
    return (
      <StyledPaper>
        <Typography color="error">
          Error fetching API keys: {error?.message}
        </Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        API Key Management
      </Typography>

      <Box mb={3} display="flex" gap={2} alignItems="center">
        <TextField
          label="New API Key Name"
          variant="outlined"
          size="small"
          fullWidth
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Enter a name for your key"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateApiKey}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Key"
          )}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="api key table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Key Value</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeysData?.keys?.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.keyName}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ wordBreak: "break-all", flexGrow: 1 }}
                    >
                      {key.apiKey}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default ApiKeyManagement;
