/**
 * This file contains declarations and code for Lucia authentication configuration
 */

import { Lucia } from "lucia";
import { drizzleAdapterInstance } from "./drizzle/adapter";
import { cache } from "react";
import { cookies } from "next/headers";
import { db } from "./drizzle";
import { sql } from "drizzle-orm";
import { usersTable } from "./drizzle/schema";

export const lucia = new Lucia(drizzleAdapterInstance, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUnCachedUser = async (): Promise<
  typeof usersTable.$inferSelect | null
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  } finally {
    if (!user) return null;
    const userData = await db.query.usersTable.findFirst({
      where: sql`id = ${user.id}`,
    });
    return userData ?? null;
  }
};

export const getUser = cache(
  async (): Promise<typeof usersTable.$inferSelect | null> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return null;
    const { user, session } = await lucia.validateSession(sessionId);
    try {
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    } finally {
      if (!user) return null;
      const userData = await db.query.usersTable.findFirst({
        where: sql`id = ${user.id}`,
      });
      return userData ?? null;
    }
  }
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
