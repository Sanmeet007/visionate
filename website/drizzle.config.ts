import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    host: process.env.DB_HOSTNAME!,
    user: process.env.DB_USERNAME!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  },
  dialect: "mysql",
  verbose: true,
  strict: true,
});
