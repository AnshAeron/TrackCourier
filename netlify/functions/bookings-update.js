import pool from "../../shared/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "PUT") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { id, provider_id, consignment_a, consignment_b } = JSON.parse(
      event.body || "{}",
    );

    if (!id || !provider_id || !consignment_a) {
      return failure(400, "Provider and Consignment A are required.");
    }

    const result = await pool.query(
      `
      UPDATE bookings
      SET
        provider_id = $1,
        consignment_a = $2,
        consignment_b = $3
      WHERE id = $4
      RETURNING *;
      `,
      [provider_id, consignment_a, consignment_b || null, id],
    );

    if (result.rowCount === 0) {
      return failure(404, "Booking not found.");
    }

    return success(200, {
      success: true,
      message: "Booking updated successfully.",
      booking: result.rows[0],
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
