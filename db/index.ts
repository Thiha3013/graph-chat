import Database from "better-sqlite3";

export const db = new Database("app.db");

// safety
db.pragma("journal_mode = WAL");
