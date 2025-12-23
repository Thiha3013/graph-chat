import { db } from "./index";
import { schema } from "./schema";

db.exec(schema);
console.log("SQLite schema initialized");
