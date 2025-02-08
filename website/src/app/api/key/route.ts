import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { NextResponse } from "next/server";

// Generates Api key
export const POST = usingAuthMiddleware(async (_, user) => {
  console.log(user.emailVerified);
  return new NextResponse();
});

// Deletes Api key
export const DELETE = usingAuthMiddleware(async (_, user) => {
  console.log(user.emailVerified);
  return new NextResponse();
});