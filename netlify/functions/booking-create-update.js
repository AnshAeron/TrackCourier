import { pool } from "../lib/db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      status: "0",
      action: "FAILED",
      message: "Method Not Allowed",
      awb_number: "",
      tracking_url: "",
      tracking_qr_image_url: "",
    });
  }

  let client;

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      token,
      provider_id,
      provider,
      internal_tracking_id,
      provider_tracking_id,
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
    } = body;

    if (!token) {
      return jsonResponse(403, {
        status: "0",
        action: "FAILED",
        message: "token not found",
        awb_number: "",
        tracking_url: "",
        tracking_qr_image_url: "",
      });
    }

    if (token != "dhaqo9q8dzmv63eahdb5m0fla3eskwvg") {
      return jsonResponse(403, {
        status: "0",
        action: "FAILED",
        message: "Invalid token",
        awb_number: "",
        tracking_url: "",
        tracking_qr_image_url: "",
      });
    }
    
    // Only these two are mandatory
    if (!internal_tracking_id || (!provider_id && !provider)) {
      return jsonResponse(400, {
        status: "0",
        action: "FAILED",
        message: "Not found mandatory fields - internal_tracking_id and provider",
        awb_number: "",
        tracking_url: "",
        tracking_qr_image_url: "",
      });
    }

    if (!provider_tracking_id) {
      provider_tracking_id = "NA";
    }
    const consignmentA = String(internal_tracking_id).trim();

    client = await pool.connect();

    /*
     * ---------------------------------------------------------
     * 1. Find provider
     * ---------------------------------------------------------
     */

    let providerResult;

    if (provider_id) {
      providerResult = await client.query(
        `
        SELECT id, name
        FROM courier_providers
        WHERE id = $1
        LIMIT 1
        `,
        [provider_id],
      );
    } else {
      providerResult = await client.query(
        `
        SELECT id, name
        FROM courier_providers
        WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
        LIMIT 1
        `,
        [provider],
      );
    }

    if (providerResult.rowCount === 0) {
      return jsonResponse(400, {
        status: "0",
        action: "FAILED",
        message: "Inavlid provider",
        awb_number: "",
        tracking_url: "",
        tracking_qr_image_url: "",
      });
    }

    const resolvedProviderId = providerResult.rows[0].id;

    /*
     * ---------------------------------------------------------
     * 2. Check Consignment A
     * ---------------------------------------------------------
     */

    const existingResult = await client.query(
      `
      SELECT id
      FROM bookings
      WHERE TRIM(consignment_a) = TRIM($1)
      LIMIT 1
      `,
      [consignmentA],
    );

    let action;
    let booking;

    /*
     * ---------------------------------------------------------
     * 3. UPDATE existing booking
     * ---------------------------------------------------------
     */

    if (existingResult.rowCount > 0) {
      const bookingId = existingResult.rows[0].id;

      const updateResult = await client.query(
        `
        UPDATE bookings
        SET
          provider_id = $1,
          consignment_b = $2,
          sender_name = $3,
          sender_phone = $4,
          recipient_name = $5,
          recipient_phone = $6,
          booking_date = $7,
          contents = $8,
          pieces = $9,
          weight = $10,
          origin_country = $11,
          destination_country = $12
        WHERE id = $13
        RETURNING *
        `,
        [
          resolvedProviderId,
          provider_tracking_id || null,
          sender_name || null,
          sender_phone || null,
          recipient_name || null,
          recipient_phone || null,
          booking_date || null,
          contents || null,
          pieces ?? null,
          weight ?? null,
          origin_country || null,
          destination_country || null,
          bookingId,
        ],
      );

      booking = updateResult.rows[0];
      action = "UPDATED";
    } else {

    /*
     * ---------------------------------------------------------
     * 4. CREATE new booking
     * ---------------------------------------------------------
     */
      const insertResult = await client.query(
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
        VALUES
        (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13
        )
        RETURNING *
        `,
        [
          resolvedProviderId,
          consignmentA,
          provider_tracking_id || null,
          sender_name || null,
          sender_phone || null,
          recipient_name || null,
          recipient_phone || null,
          booking_date || null,
          contents || null,
          pieces ?? null,
          weight ?? null,
          origin_country || null,
          destination_country || null,
        ],
      );

      booking = insertResult.rows[0];
      action = "CREATED";
    }

    /*
     * ---------------------------------------------------------
     * 5. Generate tracking URL
     * ---------------------------------------------------------
     */

    const trackingUrl = `https://trackmycourier.in/track?id=${encodeURIComponent(consignmentA)}`;

    /*
     * QR endpoint will be created in the next step.
     */

    const trackingQrImageUrl = `https://trackmycourier.in/qr/${encodeURIComponent(consignmentA)}.png`;

    console.log("========== BOOKING CREATE/UPDATE ==========");
    console.log("ACTION:", action);
    console.log("CONSignment A:", consignmentA);
    console.log("PROVIDER ID:", resolvedProviderId);

    return jsonResponse(200, {
      status: "1",
      action,
      awb_number: consignmentA,
      tracking_url: trackingUrl,
      tracking_qr_image_url: trackingQrImageUrl,
    });
  } catch (err) {
    console.error("Booking Create/Update Error:", err);

    return jsonResponse(500, {
      status: "0",
      action: "FAILED",
      message: "Some processing error, please try again",
      awb_number: "",
      tracking_url: "",
      tracking_qr_image_url: "",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
