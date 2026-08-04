import pool from "../../shared/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "DELETE") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { id } = JSON.parse(event.body || "{}");

    if (!id) {
      return failure(400, "Provider id is required.");
    }

    const result = await pool.query(
      `
      DELETE FROM courier_providers
      WHERE id = $1
      RETURNING *;
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return failure(404, "Provider not found.");
    }

    return success(200, {
      success: true,
      message: "Provider deleted successfully.",
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
