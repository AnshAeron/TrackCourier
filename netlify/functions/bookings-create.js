import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const {
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

    if (!provider_id || !consignment_a) {
      return failure(400, "Provider and Consignment A are required.");
    }

    const result = await pool.query(
      `
      INSERT INTO bookings
      (
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
        destination_country
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13
      )
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
      ],
    );

    const booking = result.rows[0];
    try {
      const baseUrl = process.env.URL || "http://localhost:8888";

      const smsResponse = await fetch(
        `${baseUrl}/.netlify/functions/send-sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: event.headers.authorization || "",
          },
          body: JSON.stringify({
            consignment_a: booking.consignment_a,
          }),
        },
      );

      const smsResult = await smsResponse.json();

      console.log("Create Booking SMS Response:", smsResult);
    } catch (smsError) {
      console.error("Create Booking SMS Error:", smsError);
    }

    return success(201, {
      success: true,
      message: "Booking created successfully.",
      booking ,
    });
  } catch (err) {
    console.error("Booking create error:", err);

    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
