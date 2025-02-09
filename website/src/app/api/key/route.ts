/**
 * API Endpoints for Managing API Keys:
 *
 * - **POST** `/api/key` → Generate a new API key.
 * - **PUT** `/api/key` → Update API key settings (activate/disable).
 * - **DELETE** `/api/key` → Delete an existing API key.
 *
 */

import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { NextResponse } from "next/server";

export const POST = usingAuthMiddleware(async (_, user) => {
  console.log(user.emailVerified);
  return new NextResponse();
});

export const PUT = usingAuthMiddleware(async (_, user) => {
  console.log(user.subscriptionType);
  return new NextResponse();
});

export const DELETE = usingAuthMiddleware(async (_, user) => {
  console.log(user.emailVerified);
  return new NextResponse();
});
