import pool from "../../shared/db.js";
import { success, failure } from "../../shared/response.js";

export async function handler() {
  try {
    const result = await pool.query("SELECT NOW()");

    return success(200, {
      success: true,
      message: "Database Connected Successfully!",
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    return failure(500, err.message);
  }
}
