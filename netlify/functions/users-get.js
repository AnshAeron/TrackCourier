import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";


export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const result = await pool.query(`
      SELECT
        id,
        username,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC;
    `);

    return success(200, {
      success: true,
      users: result.rows,
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
