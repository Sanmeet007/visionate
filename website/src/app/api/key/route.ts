import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { NextResponse } from "next/server";

// Generates API key
export const POST = usingAuthMiddleware(async (_, user) => {
  console.log(user.emailVerified);
  return new NextResponse();
});
