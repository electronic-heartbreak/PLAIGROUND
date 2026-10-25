import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function createDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set in .env or the environment");
  }

  const pool = new Pool({ connectionString });
  return drizzle({ client: pool });
}

const globalForDatabase = globalThis as typeof globalThis & {
  database?: ReturnType<typeof createDatabase>;
};

let database: ReturnType<typeof createDatabase> | undefined;

// Initialize on first use, so builds do not need a database connection.
// Reuse the pool across development hot reloads.
export function getDb() {
  database ??= globalForDatabase.database ?? createDatabase();

  if (process.env.NODE_ENV !== "production") {
    globalForDatabase.database = database;
  }

  return database;
}
