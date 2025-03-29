"use server";

import { getUser } from "@/auth";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata = (): Metadata => ({
  title: "Protected route",
});

export default async function ProtectedRoute() {
  const user = await getUser();
  if (user)
    return (
      <>
        <Box
          sx={{
            display: "grid",
            placeContent: "center",
            minHeight: "100svh",
          }}
        >
          <Typography variant="h5">This page is protected !</Typography>
        </Box>
      </>
    );
  else redirect("/");
}
