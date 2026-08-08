import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "PUT") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const {
      id,
      provider_id,
      consignment_a,
      consignment_b,
      sender_name,
      sender_phone,
      recipient_name,
      recipient_phone,
      booking_date,
      contents,
      pieces,
      weight,
      origin_country,
      destination_country,
    } = JSON.parse(event.body || "{}");

    if (!id || !provider_id || !consignment_a) {
      return failure(400, "Provider and Consignment A are required.");
    }

    const result = await pool.query(
      `
      UPDATE bookings
      SET
        provider_id = $1,
        consignment_a = $2,
        consignment_b = $3,
        sender_name = $4,
        sender_phone = $5,
        recipient_name = $6,
        recipient_phone = $7,
        booking_date = $8,
        contents = $9,
        pieces = $10,
        weight = $11,
        origin_country = $12,
        destination_country = $13
      WHERE id = $14
      RETURNING *;
      `,
      [
        provider_id,
        consignment_a,
        consignment_b || null,
        sender_name || null,
        sender_phone || null,
        recipient_name || null,
        recipient_phone || null,
        booking_date || null,
        contents || null,
        pieces || null,
        weight || null,
        origin_country || null,
        destination_country || null,
        id,
      ],
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
    console.error("Update Booking Error:", err);

    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
