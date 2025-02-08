/**
 * This file contains the schemas for the tables in MySQL database
 * using Drizzle ORM
 */

import {
  int,
  timestamp,
  mysqlTable,
  varchar,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["admin", "customer"]).notNull().default("customer"),
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
  profileImage: varchar("profile_image", { length: 255 }),
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
  id: int("id").primaryKey().autoincrement(),
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
