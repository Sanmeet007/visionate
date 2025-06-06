import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  const hostHeader =
    request.headers.get("Host") || request.headers.get("X-Forwarded-Host");
  // CSRF PREVENTION
  if (
    (!originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])) &&
    process.env.ENABLE_CSRF === "true"
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}
