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

// Declare a global variable to hold the connection pool
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

/**
 * Gets or creates the MySQL connection pool.  This uses a singleton pattern
 * to ensure that only one pool is ever created, even with multiple hot reloads
 * in Next.js development.
 **/
function getMysqlPool(): mysql.Pool {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: process.env.DB_HOSTNAME,
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      connectionLimit: 10,
    });
  }
  return global.mysqlPool;
}

/**
 * MySQL database cum Drizzle object
 * - Represents the MySQL database connection
 */
const db = drizzle(getMysqlPool(), {
  schema,
  mode: "default",
}) as MySql2Database<typeof schema>;

export { db };
