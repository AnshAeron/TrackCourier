import axios from "axios";
import { pool } from "../lib/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

  const body = JSON.parse(event.body || "{}");

  const { consignment_a, token } = body;

  const internalTokenValid =
    token &&
    process.env.SMS_FUNCTION_TOKEN &&
    token === process.env.SMS_FUNCTION_TOKEN;

  if (!internalTokenValid) {
    requireAdmin(event);
  }

  if (!consignment_a?.trim()) {
    return failure(400, "Consignment A is required.");
  }

    if (!consignment_a?.trim()) {
      return failure(400, "Consignment A is required.");
    }

    const result = await pool.query(
      `
      SELECT
        consignment_a,
        sender_phone,
        booking_date,
        destination_country,
        recipient_name
      FROM bookings
      WHERE TRIM(consignment_a) = TRIM($1)
      LIMIT 1;
      `,
      [consignment_a.trim()],
    );

    if (result.rows.length === 0) {
      return failure(404, "Booking not found.");
    }

    const booking = result.rows[0];

    if (!booking.sender_phone) {
      return failure(400, "Sender phone number is missing.");
    }

    const formattedBookingDate = booking.booking_date
      ? String(booking.booking_date)
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-")
      : "";

    const smsText =
      `Anuj Communications Courier Ropar We have received AWB No. ${booking.consignment_a} ` +
      `Dated ${formattedBookingDate} ` +
      `Booked for ${booking.destination_country || ""} ` +
      `for ${booking.recipient_name || ""} ` +
      `https://trackmycourier.in/track?id=${encodeURIComponent(
        booking.consignment_a,
      )}`;

    const smsResponse = await axios.get(
      "https://sms.nationalbulksms.com/fe/api/v1/send",
      {
        params: {
          username: process.env.SMS_USERNAME,
          password: process.env.SMS_PASSWORD,
          unicode: "false",
          from: process.env.SMS_FROM,
          to: booking.sender_phone,
          dltContentId: process.env.SMS_DLT_CONTENT_ID,
          dltPrincipalEntityId: process.env.SMS_DLT_PRINCIPAL_ENTITY_ID,
          text: smsText,
        },
      },
    );

    console.log("SMS API RESPONSE:", smsResponse.data);

    if (smsResponse.data?.state !== "SUBMIT_ACCEPTED") {
      return failure(
        502,
        smsResponse.data?.description || "SMS sending failed.",
      );
    }

    return success(200, {
      success: true,
      message: "SMS sent successfully.",
      transactionId: smsResponse.data.transactionId,
    });
  } catch (err) {
    console.error("Send SMS error:", err);

    if (
      err.message === "Access denied" ||
      err.message === "No token provided"
    ) {
      return failure(401, err.message);
    }

    return failure(500, err.message);
  }
}
