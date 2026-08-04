import pool from "../../shared/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "PUT") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { id, name, logo_url, tracking_base_url } = JSON.parse(
      event.body || "{}",
    );

    if (!id || !name || !logo_url || !tracking_base_url) {
      return failure(400, "All fields are required.");
    }

    const result = await pool.query(
      `
      UPDATE courier_providers
      SET
        name = $1,
        logo_url = $2,
        tracking_base_url = $3
      WHERE id = $4
      RETURNING *;
      `,
      [name, logo_url, tracking_base_url, id],
    );

    if (result.rowCount === 0) {
      return failure(404, "Provider not found.");
    }

    return success(200, {
      success: true,
      message: "Provider updated successfully.",
      provider: result.rows[0],
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
