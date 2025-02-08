import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from ".";
import { sessionTable, usersTable } from "./schema";

/**
 * Drizzle adapter instance (singleton)
 * - Represents a single instance of the Drizzle adapter
 */
export const drizzleAdapterInstance = new DrizzleMySQLAdapter(
  db,
  sessionTable,
  usersTable
);
