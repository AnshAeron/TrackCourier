import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import axios from "axios";

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

    if (sender_phone) {
      console.log("SMS USERNAME:", process.env.SMS_USERNAME);
      console.log(
        "SMS CREDENTIAL CHECK:",
        process.env.SMS_USERNAME === "anujcom.trans",
        process.env.SMS_PASSWORD === "wVIIc",
      );
      console.log("SMS PASSWORD LENGTH:", process.env.SMS_PASSWORD?.length);
      console.log("SMS FROM:", process.env.SMS_FROM);
      console.log("SMS TO:", sender_phone);
      try {
        const formattedBookingDate = booking_date
          ? booking_date.split("T")[0].split("-").reverse().join("-")
          : "";
        const smsText =
          `Anuj Communications Courier Ropar We have received AWB No. ${consignment_a} ` +
          `Dated ${formattedBookingDate|| ""} Booked for ${destination_country || ""} ` +
          `for ${recipient_name || ""} ` +
          `https://trackmycourier.in/track?id=${encodeURIComponent(consignment_a)}`;
const smsResponse = await axios.get(
  "https://sms.nationalbulksms.com/fe/api/v1/send",
  {
    params: {
      username: process.env.SMS_USERNAME,
      password: process.env.SMS_PASSWORD,
      unicode: "false",
      from: process.env.SMS_FROM,
      to: sender_phone,
      dltContentId: process.env.SMS_DLT_CONTENT_ID,
      dltPrincipalEntityId: process.env.SMS_DLT_PRINCIPAL_ENTITY_ID,
      text: smsText,
    },
  },
);

console.log("========== SMS API RESPONSE ==========");
console.log("HTTP STATUS:", smsResponse.status);
console.log("RESPONSE:", smsResponse.data);
      } catch (smsError) {
        console.error(
          "⚠ SMS failed:",
          smsError.response?.data || smsError.message,
        );
      }
    }
    return success(201, {
      success: true,
      message: "Booking created successfully.",
      booking
    });
  } catch (err) {
    console.error("Booking create error:", err);

    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    return failure(500, err.message);
  }
}
