import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { NextResponse } from "next/server";

export const GET = usingAuthMiddleware(() => {
  return NextResponse.json({
    error: false,
    message: "User is valid !",
  });
});
