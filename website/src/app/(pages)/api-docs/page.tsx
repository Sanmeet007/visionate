import { Box } from "@mui/material";
import { Metadata } from "next";
import React from "react";
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

export const metadata: Metadata = {
  title: "API Documentation | Visionate",
};

const ApiDocsPage = () => {
  return (
    <Box sx={{ px: "2rem", mt: "1rem" }}>
      <div>
        <Typography variant="h4">POST /users</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Creates a new user.
        </Typography>

        <Typography variant="h6">Endpoint Details</Typography>
        <Typography>
          <strong>Method:</strong> POST
        </Typography>
        <Typography gutterBottom>
          <strong>Path:</strong> /api/v1/users
        </Typography>

        <Typography variant="h6">Request Body</Typography>
        <Typography>
          The request body should contain the information for the new user.
        </Typography>

        <Typography variant="subtitle2">Schema:</Typography>
        <TableContainer component={Paper}>
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
                <TableCell>username</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>The username for the new user.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>email</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>The email address of the new user.</TableCell>
              </TableRow>
              {/* ... more fields ... */}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle2" style={{ marginTop: 16 }}>
          Example Request:
        </Typography>
        <SyntaxHighlighter language="json" style={dark}>
          {JSON.stringify({
            username: "johndoe",
            email: "johndoe@example.com"
          }, null, 2)}
        </SyntaxHighlighter>
      </div>
    </Box>
  );
};

export default ApiDocsPage;
