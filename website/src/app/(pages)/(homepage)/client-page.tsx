"use client";
import LoginForm from "@/app/fragments/LoginForm";
import SignupForm from "@/app/fragments/SignupForm";
import { useLogoutFunction } from "@/app/providers/LogoutFnProvider";
import { useSnackbar } from "@/app/providers/SnackbarProvider";
import { useUser } from "@/app/providers/UserProvider";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

interface FormType {
  type: "login" | "signup";
}

const ClientHomePage = () => {
  const { user } = useUser();
  const logoutFn = useLogoutFunction();
  const showSnackbar = useSnackbar();

  const [currenFormState, setCurrenFormState] = useState<FormType>({
    type: "login",
  });

  const toggleState = (to: FormType) => () => {
    setCurrenFormState(to);
  };

  const handleLogout = async () => {
    try {
      await logoutFn();
      showSnackbar("success", "Logout successfull");
    } catch (e) {
      showSnackbar("error", "Something went wrong");
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "grid",
          placeContent: "center",
          minHeight: "100svh",
        }}
      >
        {user && (
          <>
            Hi {user.name || "User"},
            <Button onClick={handleLogout}>Logout to continue</Button>
            <Button LinkComponent={Link} href="/protected">
              Go to Protected route
            </Button>
          </>
        )}
        {!user && (
          <>
            <Box sx={{ width: "400px" }}>
              {currenFormState.type === "login" ? (
                <LoginForm showSignUpFn={toggleState({ type: "signup" })} />
              ) : (
                <SignupForm showLoginFn={toggleState({ type: "login" })} />
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ClientHomePage;
