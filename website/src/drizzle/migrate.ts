/**
 * This file contains code to automate migrations for Drizzle
 */

import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PASSWORD),
});

try {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(drizzle(connection), {
    migrationsFolder: "./migrations",
  });
} catch (e) {
  // Logging errors
  console.log(e);
} finally {
  // Closing connection
  await connection.end();
  process.exit();
}
