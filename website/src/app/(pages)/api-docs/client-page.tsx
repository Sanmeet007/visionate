"use client";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/duotone-dark";
import Link from "next/link";
import ResponseCodesTable from "./res-codes";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import lodash from "lodash";

function useScrollDirectionTrigger() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | null>(
    null
  );
  const [trigger, setTrigger] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY === 0) {
          setTrigger(false);
          setScrollDirection(null);
        } else if (currentScrollY > prevScrollY) {
          setTrigger(false); // Scrolling down, trigger is false
          setScrollDirection("down");
        } else if (currentScrollY < prevScrollY) {
          setTrigger(true); // Scrolling up, trigger is true
          setScrollDirection("up");
        }

        setPrevScrollY(currentScrollY);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [prevScrollY]);

  return trigger;
}

const ApiDocsClientPage = () => {
  const scrollingUp = useScrollDirectionTrigger();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 4,

          "@media screen and (max-width: 600px)": {
            flexDirection: "column",
            "& aside": {
              display: "none",
            },
          },
        }}
      >
        {/* Sidebar */}
        <Box
          component="aside"
          sx={{
            position: "sticky",
            top: "1rem",
            minWidth: "200px",
            maxHeight: "100vh",
            overflowY: "auto",
            pr: 2,
            pt: scrollingUp ? "6rem" : "0rem",
            transition: "padding ease-in-out 200ms",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Contents
          </Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="#endpoint-details">Endpoint Details</Link>
            </li>
            <li>
              <Link href="#request-body">Request Body</Link>
            </li>
            <li>
              <Link href="#example-requests">Request Examples</Link>
            </li>
            <li>
              <Link href="#response-body">Response Body</Link>
            </li>
            <li>
              <Link href="#response-codes">Response Codes</Link>
            </li>
          </ul>
        </Box>

        {/* Main Content */}
        <Box>
          <Box sx={{ mb: "2rem" }}>
            <Typography variant="h5" component={"h1"}>
              API Documentation
            </Typography>
            <Typography variant="subtitle1" sx={{ my: "1rem" }}>
              Use the Visionate API to effortlessly generate insightful and
              context-aware captions for your images, seamlessly enhancing your
              applications with intelligent visual descriptions. To get started,
              simply:
            </Typography>
            <List
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.11)",
                borderRadius: "20px",
              }}
            >
              <ListItemButton href={"/sign-up"} LinkComponent={Link}>
                <ListItemText
                  primary="Create an Account / Log In"
                  secondary="New users, please sign up for a Visionate account on our registration page. Existing users, please log in to your account."
                />
              </ListItemButton>
              <ListItemButton
                href={"/dashboard/manage-api-keys"}
                LinkComponent={Link}
              >
                <ListItemText
                  primary="Obtain Your API Key"
                  secondary='After logging in, proceed to the "API Keys" section in your dashboard to generate the unique key required for authenticating your API requests.'
                />
              </ListItemButton>
            </List>
          </Box>

          <Box id="endpoint-details" sx={{ mb: "2rem" }}>
            <Typography variant="h6" sx={{ my: "1rem" }} component={"h2"}>
              1. Endpoint Details
            </Typography>
            <Typography gutterBottom>
              <strong>Path:</strong> /api/generate-caption
            </Typography>
            <Typography>
              <strong>Method:</strong> POST
            </Typography>
          </Box>

          <Box id="request-body" sx={{ mb: "2rem" }}>
            <Typography variant="h6" sx={{ my: "1rem" }} component={"h2"}>
              2. Request Body
            </Typography>
            <Typography>
              The request body must include an image file or a URL, with
              supported formats: <strong>JPG</strong>, <strong>JPEG</strong>,{" "}
              <strong>PNG</strong>, and <strong>WEBP</strong>.
            </Typography>

            <Typography variant="subtitle2" sx={{ my: "1rem" }}>
              Schema:
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.11)",
                borderRadius: "20px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>image</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>
                      The image file to process (required if imageUrl is not
                      provided).
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>imageUrl</TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>
                      URL to the image (required if image file is not provided).
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box id="example-requests" sx={{ mb: "2rem" }}>
            <Typography variant="h6" sx={{ my: "1rem" }} component={"h2"}>
              3. Request Examples
            </Typography>
            <Box>
              <Typography component={"h3"}>Using the image url:</Typography>
              <Box id="imageurl-example-request-1" sx={{ mt: "1rem" }}>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  cURL
                </Typography>
                <SyntaxHighlighter
                  language="bash"
                  style={dark}
                  wrapLines={true}
                  lineProps={{
                    style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                  }}
                >
                  {`curl -X POST '${process.env.NEXT_PUBLIC_ORIGIN}/api/generate-caption' -H 'X-API-KEY: <YOUR-API-KEY>' -F 'imageUrl=<IMAGE-URL>'`}
                </SyntaxHighlighter>
              </Box>
              <Box id="imageurl-example-request-2" sx={{ mt: "1rem" }}>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Javascript
                </Typography>
                <SyntaxHighlighter
                  language="javascript"
                  style={dark}
                  wrapLines={true}
                  lineProps={{
                    style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                  }}
                >
                  {`const imageUrl = "<IMAGE-URL>";\nconst apiKey = "<YOUR-API-KEY>";\nconst apiUrl = "${process.env.NEXT_PUBLIC_ORIGIN}/api/generate-caption";\nconst formData = new FormData();\n\nformData.append("imageUrl", imageUrl);\n\nfetch(apiUrl, {\n  method: "POST",\n  headers: {\n    "X-API-KEY": apiKey,\n  },\n  body: formData,\n})\n  .then(response => response.json())\n  .then(data => {\n    console.log("Caption generated:", data);\n    // Handle the generated caption here\n  })\n  .catch(error => {\n    console.error("Error generating caption:", error);\n    // Handle errors here\n  });`}
                </SyntaxHighlighter>
              </Box>
            </Box>
            <Box>
              <Typography component={"h3"} sx={{ mt: "2rem" }}>
                Using the image file:
              </Typography>
              <Box id="imagefile-example-request-1" sx={{ mt: "1rem" }}>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  cURL
                </Typography>
                <SyntaxHighlighter
                  language="bash"
                  style={dark}
                  wrapLines={true}
                  lineProps={{
                    style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                  }}
                >
                  {`curl -X POST '${process.env.NEXT_PUBLIC_ORIGIN}/api/generate-caption' -H 'X-API-KEY: YOUR_API_KEY' --form 'image=@<IMAGE-FILE-PATH>'`}
                </SyntaxHighlighter>
              </Box>
              <Box id="imagefile-example-request-2" sx={{ mt: "1rem" }}>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Node.js ( version 22+ )
                </Typography>
                <SyntaxHighlighter
                  language="javascript"
                  style={dark}
                  wrapLines={true}
                  lineProps={{
                    style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                  }}
                >
                  {`const fs = require("fs");\nconst buffer = fs.readFileSync("<IMAGE-FILE-PATH>");\nconst file = new File([buffer], "image.png", { type: "image/png" });\nconst apiUrl = "${process.env.NEXT_PUBLIC_ORIGIN}/api/generate-caption";\nconst apiKey = "<YOUR-API-KEY>";\nconst formData = new FormData();\nformData.append("image", file, "image.png");\nfetch(apiUrl, {\n  method: "POST",\n  headers: {\n    "X-API-KEY": apiKey\n  },\n  body: formData\n})\n.then(res => res.json())\n.then(data => {\n  console.log("Caption generated:", data);\n})\n.catch(err => {\n  console.error("Error generating caption:", err);\n});`}
                </SyntaxHighlighter>
              </Box>
            </Box>
          </Box>

          <Box id="response-body" sx={{ mb: "2rem" }}>
            <Typography variant="h6" sx={{ my: "1rem" }} component={"h2"}>
              4. Response Body
            </Typography>
            <Typography>
              The request response will be a JSON object containing the
              generated caption.
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Success Response:
              </Typography>
              <SyntaxHighlighter
                language="javascript"
                style={dark}
                wrapLines={true}
                lineProps={{
                  style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                }}
              >
                {JSON.stringify(
                  {
                    error: false,
                    caption: "<GENERATED-CAPTION-FOR-IMAGE>",
                    message: "...",
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>
            </Box>

            <Box sx={{ mt: "1rem" }}>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Error Response:
              </Typography>
              <SyntaxHighlighter
                language="javascript"
                style={dark}
                wrapLines={true}
                lineProps={{
                  style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                }}
              >
                {JSON.stringify(
                  {
                    error: true,
                    message: "...",
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>
            </Box>
          </Box>

          <Box id="response-codes" sx={{ mb: "2rem" }}>
            <Typography variant="h6" sx={{ my: "1rem" }} component={"h2"}>
              5. Response Codes
            </Typography>
            <Typography sx={{ mb: "2rem" }}>
              Comprehensive list of API status codes returned by the server.
            </Typography>

            <ResponseCodesTable />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ApiDocsClientPage;
