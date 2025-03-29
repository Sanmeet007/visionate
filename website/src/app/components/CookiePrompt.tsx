"use client";

import Box from "@mui/material/Box";
import useLocalStorage from "@/app/hooks/localstorage";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import Slide from "@mui/material/Slide";
import { useEffect, useState } from "react";

const CookiePrompt = () => {
  const [shouldDisplayCookiePrompt, setCookiePromptValue] = useLocalStorage(
    "__visionate_cookie_prompt",
    true
  );

  const [shouldDisplayPrompt, setShouldDisplayPrompt] =
    useState<boolean>(false);

  useEffect(() => {
    if (shouldDisplayCookiePrompt !== null) {
      setShouldDisplayPrompt(shouldDisplayCookiePrompt);
    }
  }, [shouldDisplayCookiePrompt]);

  const handleConsent = () => {
    setCookiePromptValue(false);
    setShouldDisplayPrompt(false);
  };

  return (
    <Box>
      <Slide direction="up" in={shouldDisplayPrompt} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            zIndex: "1",
            bottom: 0,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#222222" : "#ffffff",
            left: 0,
            boxShadow: "0 5px 10px 10px #4949491b",
            right: 0,
          }}
        >
          <Box
            className="container"
            sx={{
              py: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "center",
                "@media screen and (max-width: 850px)": {
                  textAlign: "center",
                  flexDirection: "column",
                },
              }}
            >
              {/* // TODO : FIX COLORS IN LIGHT SCHEME  */}
              <Typography>
                This website use cookies to ensure you get the best experience
                on our website.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <Button
                  disableElevation
                  size="small"
                  sx={{
                    borderRadius: "100px",
                    textTransform: "none",
                    px: "1rem",
                    fontSize: "1rem",
                  }}
                  variant="outlined"
                  onClick={handleConsent}
                  color="secondary"
                >
                  I understand{" "}
                </Button>
                <MuiLink
                  color="secondary"
                  component={Link}
                  href="/privacy-policy"
                >
                  learn more
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default CookiePrompt;
