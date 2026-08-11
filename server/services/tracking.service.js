import { pool } from "../../netlify/lib/db.js";
import { trackSkyNet } from "./providers/skynet.service.js";
import { trackABCStar } from "./providers/abcstar.service.js";

export const getTrackingDetails = async (consignmentA) => {
  console.log("========================================");
  console.log("Searching Consignment A:", `"${consignmentA}"`);

  const result = await pool.query(
    `
    SELECT
      b.id,
      b.consignment_a,
      b.consignment_b,

      b.sender_name,
      b.sender_phone,
      b.recipient_name,
      b.recipient_phone,
      b.booking_date,
      b.contents,
      b.pieces,
      b.weight,
      b.origin_country,
      b.destination_country,
      b.provider_last_response,

      cp.name AS provider_name,
      cp.tracking_base_url
    FROM bookings b
    JOIN courier_providers cp
      ON cp.id = b.provider_id
    WHERE TRIM(b.consignment_a) = TRIM($1);
    `,
    [consignmentA.trim()],
  );

  console.log("TRACKING INPUT:", JSON.stringify(consignmentA));
  console.log("DB ROWS:", result.rows);
  console.log("DB ROW COUNT:", result.rows.length);

  if (result.rows.length === 0) {
    console.log("❌ No booking found.");
    return null;
  }

  const booking = result.rows[0];
  const provider = booking.provider_name.trim();

  let shipment;
  let apiFailed = false;

  /*
   * =========================================================
   * 1. PROVIDER API FIRST
   * =========================================================
   */

  try {
    switch (provider) {
      case "SkyNet":
        shipment = await trackSkyNet(
          booking.consignment_b,
          booking.tracking_base_url,
        );
        break;

      case "ABCStar":
        shipment = await trackABCStar(
          booking.consignment_b,
          booking.tracking_base_url,
        );
        break;

      default: {
        const baseUrl = booking.tracking_base_url?.trim();
        const trackingNo = String(booking.consignment_b || "").trim();

        if (baseUrl && baseUrl.toUpperCase() !== "NA") {
          shipment = {
            trackingId: trackingNo,
            trackingUrl: baseUrl.replace("{}", encodeURIComponent(trackingNo)),
            carrier: provider,
            redirectOnly: true,
          };
        }

        break;
      }
    }
  } catch (err) {
    console.log(`⚠ ${provider} API failed.`);
    console.error(err);

    apiFailed = true;
  }

  /*
   * =========================================================
   * 2. API SUCCESS → SAVE FULL NORMALIZED RESPONSE
   * =========================================================
   */

  if (shipment && !apiFailed) {
    console.log("✅ Fresh API tracking response received.");

    await pool.query(
      `
      UPDATE bookings
      SET provider_last_response = $1
      WHERE id = $2
      `,
      [shipment, booking.id],
    );
  }

  /*
   * =========================================================
   * 3. API FAILED → USE FULL DB CACHED RESPONSE
   * =========================================================
   */

  /*
  if (apiFailed) {
    if (booking.provider_last_response) {
      console.log("♻ Using cached tracking response from DB...");

      shipment = booking.provider_last_response;
    } else {
      console.log("⚠ No cached tracking response available.");

      return null;
    }
  }
  */
  if (apiFailed) {
    console.log("⚠ Provider API failed. Cached response will not be used.");

    shipment = {
      apiFailed: true,
      trackingId: booking.consignment_b || "",
      carrier: provider,
      status: "Tracking Unavailable",
      service: "",
      trackingUrl: "",
      travelHistory: [],
      confirmedAT: "",
      inTransitAT: "",
      deliveredAT: "",
    };
  }

  /*
   * =========================================================
   * 4. NO SHIPMENT
   * =========================================================
   */

  if (!shipment) {
    return null;
  }

  /*
   * =========================================================
   * 5. ALWAYS ADD DATABASE BOOKING INFORMATION
   * =========================================================
   */

  shipment.consignmentA = booking.consignment_a;

  shipment.sender = {
    name: booking.sender_name || "",
    phone: booking.sender_phone || "",
  };

  shipment.receiver = {
    name: booking.recipient_name || "",
    phone: booking.recipient_phone || "",
  };

  shipment.originCountry = booking.origin_country || "";
  shipment.destinationCountry = booking.destination_country || "";

  shipment.awbNumber = booking.consignment_b || booking.consignment_a || "";

  shipment.bookingDate = booking.booking_date
    ? String(booking.booking_date).substring(0, 10)
    : "";

  shipment.contents = booking.contents || "";

  shipment.pieces = booking.pieces ?? null;

  shipment.weight = booking.weight ?? null;

  console.log("========== FINAL SHIPMENT ==========");
  console.log(JSON.stringify(shipment, null, 2));

  return shipment;
};
