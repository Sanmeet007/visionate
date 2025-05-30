/**
 * This file contains the schemas for the tables in MySQL database
 * using Drizzle ORM
 */

import { eq, sql } from "drizzle-orm";
import {
  int,
  timestamp,
  mysqlTable,
  varchar,
  datetime,
  mysqlEnum,
  boolean,
  mysqlView,
  bigint,
  serial,
  unique,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["admin", "moderator", "customer"])
    .notNull()
    .default("customer"),
  subscriptionType: mysqlEnum("subscription_type", [
    "free",
    "starter",
    "pro",
    "enterprise",
  ])
    .notNull()
    .default("free"),
  phoneNumber: int("phone_number", {
    unsigned: true,
  }).unique(),
  phoneNumberVerified: timestamp("phone_number_verified", {
    mode: "date",
    fsp: 3,
  }),
  hashedPassword: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    fsp: 3,
  }),
  onboardingCompleted: timestamp("onboarding_completed", {
    mode: "date",
    fsp: 3,
  }),
  profileImage: varchar("profile_image", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const passwordChangeHistoryTable = mysqlTable("password_change_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  lastPasswordChangedAt: timestamp("last_password_changed_at").notNull(),
});

export const sessionTable = mysqlTable("sessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: datetime("expires_at").notNull(),
});

export const loginAttemptsTable = mysqlTable("login_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["failed", "success"]).notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  deviceName: varchar("device_name", { length: 255 }),
  time: timestamp("time").notNull().defaultNow(),
});

export const apiKeysTable = mysqlTable(
  "api_keys",
  {
    id: serial("id").primaryKey(),
    keyName: varchar("key_name", {
      length: 100,
    }),
    userId: varchar("user_id", {
      length: 255,
    })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    apiKey: varchar("api_key", { length: 64 }).unique().notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    unique: [unique("unique_user_keyname").on(table.userId, table.keyName)],
  })
);

export const apiRequestsTable = mysqlTable("api_requests", {
  id: serial("id").primaryKey(),
  apiKeyId: bigint("api_key_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => apiKeysTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  deviceName: varchar("device_name", { length: 255 }),
  userAgent: varchar("user_agent", { length: 1024 }),
  timestamp: timestamp("timestamp").defaultNow(),
  imageWidth: int("image_width").notNull(),
  imageHeight: int("image_height").notNull(),
  imageSize: bigint("image_size", { mode: "number", unsigned: true }).notNull(),
  imageMime: varchar("image_mime", { length: 60 }).notNull(),
  processStatus: mysqlEnum(["success", "failed"]).notNull(),
});

export const apiKeyUsageTable = mysqlView("api_key_usage_monthly").as((qb) => {
  return qb
    .select({
      apiKeyId: apiKeysTable.id,
      userId: apiKeysTable.userId,
      apiKey: apiKeysTable.apiKey,
      apiKeyName: apiKeysTable.keyName,
      userSubscriptionType: sql<string>`${usersTable.subscriptionType}`.as(
        "subscription_type"
      ),
      totalHits: sql<number>`COALESCE(COUNT(${apiRequestsTable.id}), 0)`.as(
        "total_hits"
      ),
      isActive: apiKeysTable.isActive,
      createdAt: apiKeysTable.createdAt,
      updatedAt: apiKeysTable.updatedAt,
    })
    .from(apiKeysTable)
    .leftJoin(usersTable, eq(apiKeysTable.userId, usersTable.id))
    .leftJoin(
      apiRequestsTable,
      sql`
    ${apiKeysTable.id} = ${apiRequestsTable.apiKeyId}
    AND MONTH(${apiRequestsTable.timestamp}) = MONTH(CURRENT_DATE())
    AND YEAR(${apiRequestsTable.timestamp}) = YEAR(CURRENT_DATE())
  `
    )
    .groupBy(apiKeysTable.id, usersTable.subscriptionType, apiKeysTable.userId);
});
