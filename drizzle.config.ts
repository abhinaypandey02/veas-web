import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/api/(graphql)/*/db*.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "",
  },
});
