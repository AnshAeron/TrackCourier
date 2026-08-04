import pool from "../../shared/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "DELETE") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { id } = JSON.parse(event.body || "{}");

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id=$1;
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return failure(404, "User not found.");
    }

    return success(200, {
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    return failure(500, err.message);
  }
}
