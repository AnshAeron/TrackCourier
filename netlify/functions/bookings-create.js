import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";


export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { provider_id, consignment_a, consignment_b } =
      JSON.parse(event.body || "{}");

    if (!provider_id || !consignment_a) {
      return failure(
        400,
        "Provider and Consignment A are required."
      );
    }

    const result = await pool.query(
      `
      INSERT INTO bookings
      (
        provider_id,
        consignment_a,
        consignment_b
      )
      VALUES ($1,$2,$3)
      RETURNING *;
      `,
      [provider_id, consignment_a, consignment_b || null]
    );

    return success(201, {
      success: true,
      message: "Booking created successfully.",
      booking: result.rows[0],
    });

  } catch (err) {

    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}