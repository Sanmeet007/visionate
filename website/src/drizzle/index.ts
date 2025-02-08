import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Pool connection for the database connection used by Drizzle ORM
 * - Maximum connections: 10
 * - Reuses connections
 */
const poolConnection = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  connectionLimit: 10,
});

/**
 * MySQL database cum Drizzle object
 * - Represents the MySQL database connection
 */
const db = drizzle(poolConnection, {
  schema,
  mode: "default",
}) as MySql2Database<typeof schema>;

export { db };
