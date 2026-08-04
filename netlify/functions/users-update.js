import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";


export async function handler(event) {
  try {
    if (event.httpMethod !== "PUT") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { id, username, role } = JSON.parse(event.body || "{}");

    const result = await pool.query(
      `
      UPDATE users
      SET
      username=$1,
      role=$2
      WHERE id=$3
      RETURNING
      id,
      username,
      role,
      created_at;
      `,
      [username, role, id],
    );

    if (result.rowCount === 0) {
      return failure(404, "User not found.");
    }

    return success(200, {
      success: true,
      message: "User updated successfully.",
      user: result.rows[0],
    });
  } catch (err) {
    return failure(500, err.message);
  }
}
