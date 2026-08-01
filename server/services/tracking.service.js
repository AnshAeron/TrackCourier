import pool from "../db/database.js";
import { trackSkyNet } from "./providers/skynet.service.js";
import { trackABCStar } from "./providers/abcstar.service.js";
import { normalizeSkyNet } from "./normalizers/skynet.normalizer.js";
import { normalizeABCStar } from "./normalizers/abcstar.normalizer.js";

export const getTrackingDetails = async (consignmentA) => {
  console.log("========================================");
  console.log("Searching Consignment A:", `"${consignmentA}"`);

  const result = await pool.query(
    `
    SELECT
      b.id,
      b.consignment_a,
      b.consignment_b,
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

  if (result.rows.length === 0) {
    console.log("❌ No booking found.");
    return null;
  }

  const booking = result.rows[0];

  let shipment;

  switch (booking.provider_name.trim()) {
    case "SkyNet":
      try {
        shipment = await trackSkyNet(
          booking.consignment_b,
          booking.tracking_base_url,
        );

        // Save latest API response
        await pool.query(
          `
          UPDATE bookings
          SET provider_last_response = $1
          WHERE id = $2
          `,
          [shipment, booking.id],
        );
      } catch (err) {
        console.log("⚠ SkyNet API failed.");

        if (booking.provider_last_response) {
          console.log("Using cached response...");
          shipment = booking.provider_last_response;
        } else {
          shipment = {
            trackingId: booking.consignment_b,
            trackingUrl:
              booking.tracking_base_url?.replace(
                "{}",
                encodeURIComponent(booking.consignment_b),
              ) || null,
            carrier: booking.provider_name.trim(),
            redirectOnly: true,
          };
        }
      }
      break;

    case "ABCStar":
      try {
        shipment = await trackABCStar(
          booking.consignment_b,
          booking.tracking_base_url,
        );

        await pool.query(
          `
          UPDATE bookings
          SET provider_last_response = $1
          WHERE id = $2
          `,
          [shipment, booking.id],
        );
      } catch (err) {
        console.log("⚠ ABCStar API failed.");

        if (booking.provider_last_response) {
          console.log("Using cached response...");
          shipment = booking.provider_last_response;
        } else {
          shipment = {
            trackingId: booking.consignment_b,
            trackingUrl:
              booking.tracking_base_url &&
              booking.tracking_base_url.trim().toUpperCase() !== "NA"
                ? booking.tracking_base_url.replace(
                    "{}",
                    encodeURIComponent(booking.consignment_b),
                  )
                : null,
            carrier: booking.provider_name.trim(),
            redirectOnly: true,
          };
        }
      }
      break;

    default: {
      const baseUrl = booking.tracking_base_url?.trim();
      const trackingNo = String(booking.consignment_b).trim();

      console.log("Base URL:", booking.tracking_base_url);
      console.log("Consignment B:", booking.consignment_b);

      const finalUrl = booking.tracking_base_url.replace(
        "{}",
        encodeURIComponent(String(booking.consignment_b).trim()),
      );

      console.log("FINAL URL:", finalUrl);

      shipment = {
        trackingId: booking.consignment_b,
        trackingUrl: finalUrl,
        carrier: booking.provider_name.trim(),
        redirectOnly: true,
      };

      break;
    }
  }

  if (!shipment) {
    return null;
  }

  shipment.consignmentA = booking.consignment_a;

  console.log("========== FINAL SHIPMENT ==========");
  console.log(JSON.stringify(shipment, null, 2));

  return shipment;
};
