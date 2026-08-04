import pool from "../../shared/db.js";
import { requireStaffOrAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    requireStaffOrAdmin(event);

    const result = await pool.query(`
      SELECT *
      FROM courier_providers
      ORDER BY created_at DESC;
    `);

    return success(200, {
      success: true,
      providers: result.rows,
    });
  } catch (err) {
    console.error(err);

    if (
      err.message === "Access denied" ||
      err.message === "No token provided"
    ) {
      return failure(401, err.message);
    }

    return failure(500, err.message);
  }
}
