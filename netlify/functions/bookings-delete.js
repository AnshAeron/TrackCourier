import { pool } from "../lib/db.js";
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
      return failure(400, "Booking id is required.");
    }

    const result = await pool.query(
      `
      DELETE FROM bookings
      WHERE id = $1
      RETURNING *;
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return failure(404, "Booking not found.");
    }

    return success(200, {
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
