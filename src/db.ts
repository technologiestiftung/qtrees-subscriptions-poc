// db.js
import postgres from "postgres";
import { databaseURL } from "./env.js";

const sql = postgres(databaseURL, {
  idle_timeout: 20,
  max_lifetime: 60 * 30,
}); // will use psql environment variables

export default sql;
