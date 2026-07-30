import pool from "../db/database.js";
import { trackSkyNet } from "./providers/skynet.service.js";
import { trackABCStar } from "./providers/abcstar.service.js";

export const getTrackingDetails = async (consignmentA) => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.consignment_a,
      b.consignment_b,
      cp.name AS provider_name,
      cp.tracking_base_url
    FROM bookings b
    JOIN courier_providers cp
      ON cp.id = b.provider_id
    WHERE b.consignment_a = $1;
    `,
    [consignmentA],
  );

  const booking = result.rows[0];

  if (!booking) {
    return null;
  }

  let shipment;

  switch (booking.provider_name.trim()) {
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

    default:
      shipment = {
        trackingId: booking.consignment_b,
        trackingUrl:
          booking.tracking_base_url &&
          booking.tracking_base_url.trim().toUpperCase() !== "NA"
            ? booking.tracking_base_url.trim() + booking.consignment_b
            : null,
        carrier: booking.provider_name.trim(),
        redirectOnly: true,
      };
      break;
  }

  // 👇 Consignment A frontend ko bhejo
  shipment.consignmentA = booking.consignment_a;

  console.log("Final Shipment =", shipment);

  return shipment;
};
