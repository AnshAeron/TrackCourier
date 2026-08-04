import db from "../../shared/db.js";
import { pool } from "../lib/db.js";

const pool = db.default ?? db;

export async function handler() {
  try {
    const result = await pool.query("SELECT NOW()");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        now: result.rows[0].now,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
}
