import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

function ResponseCodesTable() {
  const responseCodes = [
    { code: 200, meaning: "OK", description: "The request was successful." },
    {
      code: 400,
      meaning: "Bad Request",
      description:
        "The server could not understand the request due to invalid syntax.",
    },
    {
      code: 401,
      meaning: "Unauthorized",
      description: "The user needs to be authenticated to access the resource.",
    },
    {
      code: 403,
      meaning: "Forbidden",
      description:
        "The server understood the request, but the user does not have the necessary permissions.",
    },
    {
      code: 413,
      meaning: "Payload Too Large",
      description:
        "The image size exceeds the allowed limit for the user's plan.",
    },
    {
      code: 500,
      meaning: "Internal Server Error",
      description:
        "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    },
  ];

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.11)",
          borderRadius: "20px",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="response codes table">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responseCodes.map((row) => (
              <TableRow
                key={row.code}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.code}
                </TableCell>
                <TableCell>{row.meaning}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ResponseCodesTable;
