export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export function GET(req: NextRequest) {
  try {
    const oauth = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_ORIGIN}/api/oauth/handle`,
    });

    const google_url = "https://www.googleapis.com/";

    const authorizeUrl = oauth.generateAuthUrl({
      access_type: "offline",
      scope: ["auth/userinfo.profile openid", "auth/userinfo.email"]
        .map((x) => google_url + x)
        .join(" "),
      prompt: "consent",
      redirect_uri: `${process.env.NEXT_PUBLIC_ORIGIN}/api/oauth/handle`,
    });

    return NextResponse.json(
      {
        url: authorizeUrl,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_ORIGIN!,
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
      }
    );
  } catch (error) {
    if (Number(process.env.LOGGING_LEVEL) >= 1) {
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
